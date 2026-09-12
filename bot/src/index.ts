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

  if (telegramId) {
    // Create or update user
    await prisma.user.upsert({
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
  }

  const baseUrl = process.env.NEXT_PUBLIC_MINI_APP_URL || 'https://t.me/your_bot/your_app';
  const miniAppUrl = telegramId
    ? `${baseUrl}/mini-app?auth=${generateAuthToken(telegramId)}`
    : `${baseUrl}/mini-app`;

  await ctx.reply(
    `👋 Привет, ${firstName || 'пользователь'}!\n\n` +
      `Добро пожаловать в UcShop1 — магазин цифровых товаров и игровых пополнений!\n\n` +
      `🎮 У нас вы можете купить:\n` +
      `• Telegram Stars\n` +
      `• Валюту для игр (PUBG, Roblox, Genshin Impact и др.)\n` +
      `• Подарочные карты (Steam, PlayStation, Xbox)\n` +
      `• Подписки (Discord Nitro)\n\n` +
      `⚡ Быстрая доставка после оплаты\n` +
      `💎 Реферальная программа с бонусами\n\n` +
      `Нажмите кнопку ниже, чтобы открыть магазин:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛒 Открыть магазин',
              web_app: { url: miniAppUrl },
            },
          ],
          [
            { text: '📋 Мои заказы', callback_data: 'orders' },
            { text: '👤 Профиль', callback_data: 'profile' },
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
  await ctx.reply(
    `❓ *Часто задаваемые вопросы*\n\n` +
      `*Как быстро я получу товар?*\n` +
      `Товары выдаются автоматически в течение 1-5 минут после оплаты.\n\n` +
      `*Какие способы оплаты?*\n` +
      `Мы принимаем оплату через СБП (Система быстрых платежей).\n\n` +
      `*Что делать если товар не пришёл?*\n` +
      `Свяжитесь с поддержкой через бота.`,
    { parse_mode: 'Markdown' }
  );
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
