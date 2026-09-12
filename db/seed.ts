import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем seed базы данных...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();

  console.log('✅ Очистка завершена');

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@ucshop1.ru',
      password: adminPassword,
      name: 'Super Admin',
    },
  });
  console.log('✅ Админ создан');

  // Create Test User
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      telegramId: '123456789',
      telegramUsername: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@ucshop1.ru',
      password: userPassword,
      referralCode: 'TESTREF',
    },
  });
  console.log('✅ Тестовый пользователь создан');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        slug: 'telegram-stars',
        name: 'Telegram Stars',
        description: 'Покупайте Telegram Stars для поддержки авторов',
        icon: '⭐',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'pubg-mobile',
        name: 'PUBG Mobile',
        description: 'UC для PUBG Mobile',
        icon: '🎮',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'steam',
        name: 'Steam',
        description: 'Steam Wallet и подарочные карты',
        icon: '🎮',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'roblox',
        name: 'Roblox',
        description: 'Robux для Roblox',
        icon: '🎮',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'mobile-games',
        name: 'Мобильные игры',
        description: 'Free Fire, Mobile Legends и другие',
        icon: '📱',
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'pc-games',
        name: 'PC игры',
        description: 'Genshin Impact, Valorant, LoL',
        icon: '💻',
        order: 6,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'gift-cards',
        name: 'Подарочные карты',
        description: 'PlayStation, Xbox, Nintendo',
        icon: '🎁',
        order: 7,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'subscriptions',
        name: 'Подписки',
        description: 'Discord Nitro и другие подписки',
        icon: '💎',
        order: 8,
      },
    }),
  ]);
  console.log('✅ Категории созданы');

  // Create Products
  const products = await Promise.all([
    // Telegram Stars
    prisma.product.create({
      data: {
        slug: 'telegram-stars',
        categoryId: categories[0].id,
        name: 'Telegram Stars',
        description: 'Поддержите любимых авторов в Telegram',
        isActive: true,
        isFeatured: true,
        order: 1,
        variants: {
          create: [
            { name: '50 Stars', price: 59, order: 1 },
            { name: '100 Stars', price: 119, order: 2 },
            { name: '250 Stars', price: 299, order: 3 },
            { name: '500 Stars', price: 599, order: 4 },
            { name: '1000 Stars', price: 1199, order: 5 },
          ],
        },
      },
    }),
    // PUBG Mobile UC
    prisma.product.create({
      data: {
        slug: 'pubg-mobile-uc',
        categoryId: categories[1].id,
        name: 'PUBG Mobile UC',
        description: 'Неизвестные Cash для PUBG Mobile',
        isActive: true,
        isFeatured: true,
        order: 1,
        variants: {
          create: [
            { name: '60 UC', price: 89, order: 1 },
            { name: '325 UC', price: 449, order: 2 },
            { name: '660 UC', price: 899, order: 3 },
            { name: '1800 UC', price: 2399, order: 4 },
            { name: '3850 UC', price: 4999, order: 5 },
          ],
        },
      },
    }),
    // Steam Wallet
    prisma.product.create({
      data: {
        slug: 'steam-wallet',
        categoryId: categories[2].id,
        name: 'Steam Wallet',
        description: 'Пополнение Steam Wallet',
        isActive: true,
        isFeatured: true,
        order: 1,
        variants: {
          create: [
            { name: '100 RUB', price: 100, order: 1 },
            { name: '250 RUB', price: 250, order: 2 },
            { name: '500 RUB', price: 500, order: 3 },
            { name: '1000 RUB', price: 1000, order: 4 },
            { name: '2500 RUB', price: 2500, order: 5 },
          ],
        },
      },
    }),
    // Roblox Robux
    prisma.product.create({
      data: {
        slug: 'roblox-robux',
        categoryId: categories[3].id,
        name: 'Roblox Robux',
        description: 'Robux для Roblox',
        isActive: true,
        order: 1,
        variants: {
          create: [
            { name: '80 Robux', price: 99, order: 1 },
            { name: '400 Robux', price: 499, order: 2 },
            { name: '800 Robux', price: 999, order: 3 },
            { name: '1700 Robux', price: 1999, order: 4 },
            { name: '4500 Robux', price: 4999, order: 5 },
          ],
        },
      },
    }),
    // Free Fire Diamonds
    prisma.product.create({
      data: {
        slug: 'free-fire-diamonds',
        categoryId: categories[4].id,
        name: 'Free Fire Diamonds',
        description: 'Алмазы для Free Fire',
        isActive: true,
        order: 1,
        variants: {
          create: [
            { name: '100 Diamonds', price: 99, order: 1 },
            { name: '310 Diamonds', price: 299, order: 2 },
            { name: '520 Diamonds', price: 499, order: 3 },
            { name: '1060 Diamonds', price: 999, order: 4 },
            { name: '2180 Diamonds', price: 1999, order: 5 },
          ],
        },
      },
    }),
    // Mobile Legends Diamonds
    prisma.product.create({
      data: {
        slug: 'mobile-legends-diamonds',
        categoryId: categories[4].id,
        name: 'Mobile Legends Diamonds',
        description: 'Алмазы для Mobile Legends',
        isActive: true,
        order: 2,
        variants: {
          create: [
            { name: '11 Diamonds', price: 29, order: 1 },
            { name: '50 Diamonds', price: 129, order: 2 },
            { name: '250 Diamonds', price: 649, order: 3 },
            { name: '500 Diamonds', price: 1299, order: 4 },
            { name: '1000 Diamonds', price: 2599, order: 5 },
          ],
        },
      },
    }),
    // Genshin Impact
    prisma.product.create({
      data: {
        slug: 'genshin-impact-crystals',
        categoryId: categories[5].id,
        name: 'Genshin Impact Genesis Crystals',
        description: 'Кристаллы genesis для Genshin Impact',
        isActive: true,
        isFeatured: true,
        order: 1,
        variants: {
          create: [
            { name: '60 Crystals', price: 99, order: 1 },
            { name: '300 Crystals', price: 449, order: 2 },
            { name: '980 Crystals', price: 1299, order: 3 },
            { name: '1980 Crystals', price: 2499, order: 4 },
            { name: '3280 Crystals', price: 3999, order: 5 },
          ],
        },
      },
    }),
    // Honkai Star Rail
    prisma.product.create({
      data: {
        slug: 'honkai-star-rail-shards',
        categoryId: categories[5].id,
        name: 'Honkai Star Rail Oneiric Shards',
        description: 'Сновидческие осколки для Honkai Star Rail',
        isActive: true,
        order: 2,
        variants: {
          create: [
            { name: '60 Shards', price: 99, order: 1 },
            { name: '300 Shards', price: 449, order: 2 },
            { name: '980 Shards', price: 1299, order: 3 },
            { name: '1980 Shards', price: 2499, order: 4 },
            { name: '3280 Shards', price: 3999, order: 5 },
          ],
        },
      },
    }),
    // Valorant Points
    prisma.product.create({
      data: {
        slug: 'valorant-points',
        categoryId: categories[5].id,
        name: 'Valorant Points',
        description: 'VP для Valorant',
        isActive: true,
        order: 3,
        variants: {
          create: [
            { name: '475 VP', price: 499, order: 1 },
            { name: '1000 VP', price: 999, order: 2 },
            { name: '2050 VP', price: 1999, order: 3 },
            { name: '3650 VP', price: 3499, order: 4 },
            { name: '5350 VP', price: 4999, order: 5 },
          ],
        },
      },
    }),
    // League of Legends RP
    prisma.product.create({
      data: {
        slug: 'lol-rp',
        categoryId: categories[5].id,
        name: 'League of Legends RP',
        description: 'Riot Points для League of Legends',
        isActive: true,
        order: 4,
        variants: {
          create: [
            { name: '650 RP', price: 399, order: 1 },
            { name: '1380 RP', price: 799, order: 2 },
            { name: '2800 RP', price: 1599, order: 3 },
            { name: '5000 RP', price: 2799, order: 4 },
            { name: '8200 RP', price: 4499, order: 5 },
          ],
        },
      },
    }),
    // Brawl Stars Gems
    prisma.product.create({
      data: {
        slug: 'brawl-stars-gems',
        categoryId: categories[4].id,
        name: 'Brawl Stars Gems',
        description: 'Гемы для Brawl Stars',
        isActive: true,
        order: 3,
        variants: {
          create: [
            { name: '30 Gems', price: 99, order: 1 },
            { name: '80 Gems', price: 249, order: 2 },
            { name: '170 Gems', price: 499, order: 3 },
            { name: '350 Gems', price: 999, order: 4 },
            { name: '700 Gems', price: 1999, order: 5 },
          ],
        },
      },
    }),
    // Clash of Clans Gems
    prisma.product.create({
      data: {
        slug: 'clash-of-clans-gems',
        categoryId: categories[4].id,
        name: 'Clash of Clans Gems',
        description: 'Гемы для Clash of Clans',
        isActive: true,
        order: 4,
        variants: {
          create: [
            { name: '80 Gems', price: 99, order: 1 },
            { name: '500 Gems', price: 499, order: 2 },
            { name: '1200 Gems', price: 999, order: 3 },
            { name: '2500 Gems', price: 1999, order: 4 },
            { name: '6500 Gems', price: 4999, order: 5 },
          ],
        },
      },
    }),
    // Clash Royale
    prisma.product.create({
      data: {
        slug: 'clash-royale-gems',
        categoryId: categories[4].id,
        name: 'Clash Royale Gems',
        description: 'Гемы для Clash Royale',
        isActive: true,
        order: 5,
        variants: {
          create: [
            { name: '80 Gems', price: 99, order: 1 },
            { name: '500 Gems', price: 499, order: 2 },
            { name: '1200 Gems', price: 999, order: 3 },
            { name: '2500 Gems', price: 1999, order: 4 },
            { name: '6500 Gems', price: 4999, order: 5 },
          ],
        },
      },
    }),
    // Call of Duty Mobile
    prisma.product.create({
      data: {
        slug: 'cod-mobile-cp',
        categoryId: categories[4].id,
        name: 'Call of Duty Mobile CP',
        description: 'CP Points для Call of Duty Mobile',
        isActive: true,
        order: 6,
        variants: {
          create: [
            { name: '80 CP', price: 99, order: 1 },
            { name: '400 CP', price: 499, order: 2 },
            { name: '880 CP', price: 999, order: 3 },
            { name: '2400 CP', price: 2499, order: 4 },
            { name: '4800 CP', price: 4999, order: 5 },
          ],
        },
      },
    }),
    // PlayStation
    prisma.product.create({
      data: {
        slug: 'playstation-wallet',
        categoryId: categories[6].id,
        name: 'PlayStation Wallet',
        description: 'Пополнение PlayStation Wallet',
        isActive: true,
        order: 1,
        variants: {
          create: [
            { name: '500 RUB', price: 520, order: 1 },
            { name: '1000 RUB', price: 1040, order: 2 },
            { name: '2000 RUB', price: 2080, order: 3 },
            { name: '5000 RUB', price: 5200, order: 4 },
          ],
        },
      },
    }),
    // Xbox
    prisma.product.create({
      data: {
        slug: 'xbox-wallet',
        categoryId: categories[6].id,
        name: 'Xbox Wallet',
        description: 'Пополнение Xbox Wallet',
        isActive: true,
        order: 2,
        variants: {
          create: [
            { name: '500 RUB', price: 520, order: 1 },
            { name: '1000 RUB', price: 1040, order: 2 },
            { name: '2000 RUB', price: 2080, order: 3 },
            { name: '5000 RUB', price: 5200, order: 4 },
          ],
        },
      },
    }),
    // Nintendo eShop
    prisma.product.create({
      data: {
        slug: 'nintendo-eshop',
        categoryId: categories[6].id,
        name: 'Nintendo eShop',
        description: 'Пополнение Nintendo eShop',
        isActive: true,
        order: 3,
        variants: {
          create: [
            { name: '500 RUB', price: 520, order: 1 },
            { name: '1000 RUB', price: 1040, order: 2 },
            { name: '2000 RUB', price: 2080, order: 3 },
            { name: '5000 RUB', price: 5200, order: 4 },
          ],
        },
      },
    }),
    // Google Play
    prisma.product.create({
      data: {
        slug: 'google-play',
        categoryId: categories[6].id,
        name: 'Google Play',
        description: 'Подарочные карты Google Play',
        isActive: true,
        order: 4,
        variants: {
          create: [
            { name: '500 RUB', price: 520, order: 1 },
            { name: '1000 RUB', price: 1040, order: 2 },
            { name: '2000 RUB', price: 2080, order: 3 },
            { name: '5000 RUB', price: 5200, order: 4 },
          ],
        },
      },
    }),
    // Apple iTunes
    prisma.product.create({
      data: {
        slug: 'apple-itunes',
        categoryId: categories[6].id,
        name: 'Apple iTunes',
        description: 'Подарочные карты Apple iTunes',
        isActive: true,
        order: 5,
        variants: {
          create: [
            { name: '500 RUB', price: 520, order: 1 },
            { name: '1000 RUB', price: 1040, order: 2 },
            { name: '2000 RUB', price: 2080, order: 3 },
            { name: '5000 RUB', price: 5200, order: 4 },
          ],
        },
      },
    }),
    // Discord Nitro
    prisma.product.create({
      data: {
        slug: 'discord-nitro',
        categoryId: categories[7].id,
        name: 'Discord Nitro',
        description: 'Подписка Discord Nitro',
        isActive: true,
        isFeatured: true,
        order: 1,
        variants: {
          create: [
            { name: '1 месяц', price: 349, order: 1 },
            { name: '3 месяца', price: 899, order: 2 },
            { name: '6 месяцев', price: 1699, order: 3 },
            { name: '12 месяцев', price: 3199, order: 4 },
          ],
        },
      },
    }),
  ]);
  console.log('✅ Товары созданы');

  // Create Banners
  await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Telegram Stars',
        description: 'Поддержите любимых авторов',
        linkUrl: '/telegram-stars',
        order: 1,
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Genshin Impact',
        description: 'Кристаллы genesis со скидкой',
        linkUrl: '/genshin-impact-crystals',
        order: 2,
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Discord Nitro',
        description: 'Улучшите свой Discord',
        linkUrl: '/discord-nitro',
        order: 3,
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Баннеры созданы');

  // Create Settings
  await Promise.all([
    prisma.settings.create({
      data: {
        key: 'site_name',
        value: 'UcShop1',
        type: 'string',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'site_description',
        value: 'Магазин цифровых товаров и игровых пополнений',
        type: 'string',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'currency',
        value: 'RUB',
        type: 'string',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'referral_percent',
        value: '0.5',
        type: 'string',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'min_withdrawal',
        value: '4000',
        type: 'string',
      },
    }),
  ]);
  console.log('✅ Настройки созданы');

  // Create Test Orders
  const testOrder1 = await prisma.order.create({
    data: {
      userId: user.id,
      orderNumber: `ORD-${Date.now()}`,
      status: 'COMPLETED',
      totalAmount: 599,
      currency: 'RUB',
      discountAmount: 0,
      finalAmount: 599,
      orderData: {},
      items: {
        create: {
          productId: products[0].id,
          variantId: (await prisma.productVariant.findFirst({
            where: { productId: products[0].id, name: '500 Stars' },
          }))!.id,
          quantity: 1,
          price: 599,
          itemData: {},
        },
      },
    },
  });
  console.log('✅ Тестовые заказы созданы');

  console.log('🎉 Seed завершен успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
