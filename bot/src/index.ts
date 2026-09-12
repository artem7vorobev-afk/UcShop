import { Bot, GrammyError } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

// Generate signed auth token so mini-app can identify user even without initData
function generateAuthToken(telegramId: string): string {
  const ts = Date.now().toString();
  const sig = crypto
    .createHmac('sha256', process.env.BOT_TOKEN || '')
    .update(`${telegramId}:${ts}`)
    .digest('hex');
  return Buffer.from(`${telegramId}:${ts}:${sig}`).toString('base64url');
}

const bot = new Bot(process.env.BOT_TOKEN || '');

// Auto-retry on rate limits
bot.api.config.use(autoRetry());

// Start command
bot.command('start', async (ctx) => {
  const telegramId = ctx.from?.id.toString();
  const telegramUsername = ctx.from?.username;
  const firstName = ctx.from?.first_name;
  const lastName = ctx.from?.last_name;
  const startPayload = ctx.match?.toString().trim() || '';

  if (telegramId) {
    // Create or update user
    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        telegramUsername,
        firstName,
        lastName,
      },
      create: {
        telegramId,
        telegramUsername,
        firstName,
        lastName,
        referralCode: generateReferralCode(),
      },
    });

    // Referral link: /start ref_CODE — привязываем реферера
    if (startPayload.startsWith('ref_') && !user.referredBy) {
      const refCode = startPayload.slice(4);
      const referrer = await prisma.user.findFirst({
        where: { referralCode: refCode },
      });
      if (referrer && referrer.id !== user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { referredBy: referrer.id },
        });
        try {
          await prisma.referral.create({
            data: {
              referrerId: referrer.id,
              referredUserId: user.id,
              status: 'ACTIVE',
            },
          });
          // Уведомляем реферера о новом реферале
          if (referrer.telegramId) {
            const refName = [firstName, lastName].filter(Boolean).join(' ') || 'Пользователь';
            await ctx.api
              .sendMessage(
                referrer.telegramId,
                `🎉 У вас новый реферал: ${refName}${telegramUsername ? ` (@${telegramUsername})` : ''}!\n\n` +
                  `Вы будете получать 0.5% с каждого его заказа.`
              )
              .catch(() => {});
          }
        } catch {
          /* referral already exists */
        }
      }
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_MINI_APP_URL || 'https://t.me/your_bot/your_app';
  const miniAppUrl = telegramId
    ? `${baseUrl}/mini-app?auth=${generateAuthToken(telegramId)}`
    : `${baseUrl}/mini-app`;

  await ctx.reply(
    `� Привет, ${firstName || 'пользователь'}!\n` +
      `Добро пожаловать в PAFOS MARKET — место, где начинается твоя следующая игровая история. 🎮\n\n` +
      `Здесь ты найдёшь всё необходимое для любимых игр:\n\n` +
      `🔴 PUBG UC — пополнение UC для PUBG Mobile\n\n` +
      `🎮 STEAM — пополнение и игровые товары\n\n` +
      `⚡ Игры и подписки\n\n` +
      `💎 Telegram stars и premium\n\n` +
      `🚀 PAFOS MARKET\n` +
      `Твой игровой баланс. Твои игры. Твой выбор.\n\n` +
      `👇 Открыть магазин по кнопке ниже.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '� Открыть магазин',
              web_app: { url: miniAppUrl },
            },
          ],
          [
            {
              text: '📢 Подпишись на наш канал',
              url: 'https://t.me/PafosMarket',
            },
          ],
          [
            { text: '❓ FAQ', callback_data: 'faq' },
            { text: '💬 Поддержка', callback_data: 'support' },
          ],
        ],
      },
    }
  );
});

// Help command
bot.command('help', async (ctx) => {
  await ctx.reply(
    `📚 *Справка по UcShop1*\n\n` +
      `*Доступные команды:*\n` +
      `/start — Начать работу и открыть магазин\n` +
      `/help — Показать эту справку\n` +
      `/orders — Мои заказы\n` +
      `/profile — Мой профиль\n\n` +
      `*Как купить товар:*\n` +
      `1. Нажмите "Открыть магазин"\n` +
      `2. Выберите категорию и товар\n` +
      `3. Укажите необходимые данные\n` +
      `4. Оплатите через СБП\n` +
      `5. Получите товар автоматически\n\n` +
      `*Реферальная программа:*\n` +
      `Приглашайте друзей и получайте 0.5% от каждого их заказа!`,
    { parse_mode: 'Markdown' }
  );
});

// Orders command
bot.command('orders', async (ctx) => {
  const telegramId = ctx.from?.id.toString();
  if (!telegramId) return;

  const user = await prisma.user.findUnique({
    where: { telegramId },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!user || user.orders.length === 0) {
    await ctx.reply('📋 У вас пока нет заказов. Нажмите "Открыть магазин", чтобы сделать первый заказ!');
    return;
  }

  let message = '📋 *Ваши последние заказы:*\n\n';
  user.orders.forEach((order) => {
    const statusEmoji = getStatusEmoji(order.status);
    const productName = order.items[0]?.product?.name || 'Товар';
    message += `${statusEmoji} ${productName} — ${Number(order.finalAmount)} ₽\n`;
    message += `   Статус: ${formatOrderStatus(order.status)}\n\n`;
  });

  await ctx.reply(message, { parse_mode: 'Markdown' });
});

// Profile command
bot.command('profile', async (ctx) => {
  const telegramId = ctx.from?.id.toString();
  if (!telegramId) return;

  const user = await prisma.user.findUnique({
    where: { telegramId },
  });

  if (!user) {
    await ctx.reply('Пользователь не найден. Нажмите /start для регистрации.');
    return;
  }

  const message =
    `👤 *Ваш профиль*\n\n` +
    `Имя: ${user.firstName || ''} ${user.lastName || ''}\n` +
    `Username: @${user.telegramUsername || 'не указан'}\n` +
    `Реферальный код: \`${user.referralCode || 'не назначен'}\`\n` +
    `Баланс: ${Number(user.balance)} ₽\n\n` +
    `Приглашайте друзей по коду и получайте бонусы!`;

  await ctx.reply(message, { parse_mode: 'Markdown' });
});

// Callback handlers
bot.callbackQuery('orders', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply('📋 Для просмотра заказов используйте Mini App или команду /orders');
});

bot.callbackQuery('profile', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply('👤 Для просмотра профиля используйте Mini App или команду /profile');
});

bot.callbackQuery('faq', async (ctx) => {
  await ctx.answerCallbackQuery();

  const parts = [
    `🔥 PAFOS MARKET — FAQ\n\n` +
      `Добро пожаловать в раздел часто задаваемых вопросов.\n\n` +
      `Здесь собрана основная информация о заказах, оплате, PUBG UC, Steam, цифровых товарах и работе нашего магазина.\n\n` +
      `Если ты впервые у нас — рекомендуем ознакомиться с FAQ перед оформлением заказа. Большинство вопросов уже разобраны ниже. 👇\n\n` +
      `🎮 ОБЩАЯ ИНФОРМАЦИЯ\n\n` +
      `Что такое Pafos Market?\n` +
      `Pafos Market — магазин цифровых товаров для геймеров. У нас можно приобрести игровые товары, пополнение PUBG UC, товары для Steam, подписки и другие цифровые продукты. Мы стараемся сделать процесс максимально простым: выбрал товар → оформил заказ → оплатил → получил товар. Без лишних действий и долгого ожидания.\n\n` +
      `Какие товары можно купить?\n` +
      `Ассортимент постоянно развивается. В магазине доступны:\n` +
      `🔴 PUBG UC / PUBG Mobile\n` +
      `🎮 Steam\n` +
      `🕹️ Игровые товары\n` +
      `💎 Цифровые продукты\n` +
      `⚡ Подписки и другие игровые сервисы\n` +
      `Если нужного товара пока нет в каталоге — напиши менеджеру. Возможно, мы сможем добавить его или предложить альтернативу.`,

    `🔴 PUBG UC\n\n` +
      `Что такое PUBG UC?\n` +
      `UC (Unknown Cash) — внутриигровая валюта PUBG Mobile. За UC игроки могут приобретать различные игровые предметы, косметику, Royale Pass и другой контент, доступный внутри игры.\n\n` +
      `Можно ли купить PUBG UC через Pafos Market?\n` +
      `Да. Выбираешь нужный номинал PUBG UC, указываешь необходимые данные для пополнения, оплачиваешь заказ и следуешь инструкции магазина. Перед оплатой обязательно внимательно проверяй введённые данные.\n\n` +
      `Сколько UC можно купить?\n` +
      `Доступные номиналы отображаются непосредственно в каталоге Pafos Market. Если нужного количества UC нет — напиши менеджеру.\n\n` +
      `Сколько времени занимает пополнение PUBG UC?\n` +
      `Время обработки зависит от конкретного товара и текущей нагрузки. Большинство стандартных заказов обрабатываются автоматически либо в короткие сроки. Если заказ не был выполнен в ожидаемое время — не создавай повторный заказ. Сначала обратись в поддержку.\n\n` +
      `Я указал неправильные данные. Что делать?\n` +
      `Сразу напиши менеджеру. Если заказ ещё не был обработан, мы постараемся помочь. После выполнения заказа изменить получателя или вернуть товар может быть невозможно, поэтому всегда проверяй данные перед оплатой.`,

    `🎮 STEAM\n\n` +
      `Можно ли пополнить Steam через Pafos Market?\n` +
      `Да, если соответствующий способ пополнения доступен в каталоге. Выбирай нужный товар, внимательно проверяй регион и условия использования, после чего оформляй заказ.\n\n` +
      `Почему нужно обращать внимание на регион Steam?\n` +
      `Steam использует региональные ограничения для некоторых способов оплаты, игр, ключей и цифровых товаров. Поэтому перед покупкой важно убедиться, что выбранный товар подходит именно для твоего аккаунта. Если сомневаешься — лучше сначала спросить менеджера.\n\n` +
      `Можно ли вернуть товар после покупки?\n` +
      `Цифровые товары имеют особенности, отличающие их от физических товаров. Если код уже активирован или цифровой товар был полностью предоставлен, возможность возврата может отсутствовать. Если возникла проблема с заказом — обязательно обратись в поддержку до самостоятельной активации или повторного использования товара. Каждый случай рассматривается отдельно в соответствии с условиями конкретного товара.\n\n` +
      `💳 ОПЛАТА\n\n` +
      `Как оплатить заказ?\n` +
      `Доступные способы оплаты отображаются при оформлении заказа. Выбираешь удобный способ → оплачиваешь → возвращаешься в заказ и ожидаешь подтверждения платежа.\n\n` +
      `Я оплатил, но заказ не изменился. Что делать?\n` +
      `Не оплачивай заказ повторно. Сначала подожди несколько минут, затем проверь статус заказа. Если статус не изменился — отправь менеджеру номер заказа и информацию о проблеме.\n\n` +
      `Деньги списались, но товар не пришёл. Что делать?\n` +
      `Спокойно — главное, не оформляй второй такой же заказ. Обратись в поддержку и укажи:\n` +
      `🧾 номер заказа\n💳 способ оплаты\n⏱️ примерное время оплаты\n📌 описание проблемы\n` +
      `приложи чек об оплате в формате PDF\n` +
      `Менеджер проверит статус платежа и заказа.`,

    `📦 ЗАКАЗЫ\n\n` +
      `Где посмотреть мой заказ?\n` +
      `После оформления заказа информация о нём отображается в соответствующем разделе магазина. Сохраняй номер заказа до момента успешного получения товара.\n\n` +
      `Можно ли сделать несколько заказов одновременно?\n` +
      `Да, но если предыдущий заказ ещё обрабатывается, сначала дождись его завершения. Это особенно важно для товаров, которые нельзя повторно выдать или активировать.\n\n` +
      `Что делать, если товар не пришёл?\n` +
      `Проверь статус заказа. Если указан статус выполнения, но товар отсутствует, либо прошло больше заявленного времени обработки — обратись в поддержку. Мы проверим заказ вручную.\n\n` +
      `🛡️ БЕЗОПАСНОСТЬ\n\n` +
      `Нужно ли передавать пароль от аккаунта?\n` +
      `Никогда не передавай пароль от своего аккаунта, код из SMS, код Telegram, Steam Guard или другие секретные данные, если они не требуются официальным способом конкретного товара. Pafos Market не просит отправлять пароли в обычном чате поддержки. Если кто-то представляется сотрудником магазина и просит пароль или секретный код — не передавай данные и обратись к официальному менеджеру.\n\n` +
      `Как понять, что я общаюсь с настоящим менеджером?\n` +
      `Используй только контакты менеджера, указанные внутри официального бота/магазина Pafos Market. Не переходи по подозрительным ссылкам и не отправляй деньги пользователям, которые пишут тебе от имени магазина самостоятельно.`,

    `👨‍💻 ПОДДЕРЖКА\n\n` +
      `Как связаться с менеджером?\n` +
      `Открой раздел «Поддержка» в боте и отправь сообщение. Для ускорения решения вопроса сразу укажи номер заказа и подробно опиши проблему.\n\n` +
      `Что написать менеджеру?\n` +
      `Лучший вариант:\n` +
      `Номер заказа: #12345\n` +
      `Проблема: товар не получен\n` +
      `Время оплаты: 14:35\n` +
      `Дополнительная информация: ...\n` +
      `Так менеджер сможет быстрее найти заказ и разобраться в ситуации.\n\n` +
      `⚡ ВАЖНЫЕ ПРАВИЛА\n\n` +
      `Перед каждой покупкой:\n` +
      `✅ Проверяй название товара\n` +
      `✅ Проверяй регион\n` +
      `✅ Проверяй количество UC / сумму\n` +
      `✅ Проверяй данные получателя\n` +
      `✅ Проверяй условия товара\n` +
      `✅ Сохраняй номер заказа\n` +
      `✅ Не передавай пароли и секретные коды\n\n` +
      `После оплаты:\n` +
      `⏳ Дождись обработки заказа\n` +
      `❌ Не оплачивай повторно без необходимости\n` +
      `📩 При проблеме сразу обращайся в поддержку\n\n` +
      `🔥 НЕ НАШЁЛ ОТВЕТ?\n\n` +
      `Не проблема. Если твоего вопроса нет в FAQ, напиши менеджеру Pafos Market. Опиши ситуацию максимально подробно и приложи номер заказа, если он уже создан. Мы проверим информацию и подскажем, что делать дальше.\n\n` +
      `🎮 PAFOS MARKET\n` +
      `PUBG UC • Steam • Игровые товары • Цифровые продукты\n\n` +
      `🔥 Выбирай.\n⚡ Заказывай.\n🎮 Играй.\n\n` +
      `PAFOS MARKET — твой игровой магазин.`,
  ];

  for (const part of parts) {
    await ctx.reply(part);
  }
});

bot.callbackQuery('support', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply('💬 Для связи с поддержкой напишите @support_username');
});

// Error handling
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof Error) {
    console.error('Unknown error:', e);
  }
});

// Helper functions
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getStatusEmoji(status: string): string {
  const emojis: Record<string, string> = {
    NEW: '🆕',
    AWAITING_PAYMENT: '⏳',
    PAID: '💰',
    PROCESSING: '⚙️',
    COMPLETED: '✅',
    FAILED: '❌',
    REFUNDED: '💸',
  };
  return emojis[status] || '📦';
}

function formatOrderStatus(status: string): string {
  const statuses: Record<string, string> = {
    NEW: 'Новый',
    AWAITING_PAYMENT: 'Ожидает оплаты',
    PAID: 'Оплачен',
    PROCESSING: 'В обработке',
    COMPLETED: 'Выполнен',
    FAILED: 'Ошибка',
    REFUNDED: 'Возврат',
  };
  return statuses[status] || status;
}

// Start bot
bot.start();
console.log('🤖 Telegram Bot started');
