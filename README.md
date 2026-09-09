# UcShop1 - Telegram Mini App E-commerce

Полнофункциональный магазин цифровых товаров на базе Telegram Mini App и Telegram Bot для продажи игровых валют, подарочных карт и подписок.

## 🚀 Технологический стек

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Bot**: Grammy (Telegram Bot API)
- **Auth**: Telegram Login, Email + Password (bcryptjs)
- **Styling**: Tailwind CSS с кастомной neon/cyber темой
- **Containerization**: Docker, Docker Compose

## 📋 Этапы разработки

### Этап 1 - Фундамент проекта
- ✅ Архитектура проекта
- ✅ Prisma schema с моделями
- ✅ Seed данные (20+ товаров, категории, баннеры)
- ✅ Frontend Mini App (все страницы)
- ✅ Backend API handlers
- ✅ Telegram Bot (базовый функционал)
- ✅ Auth base (Telegram Login, Email + Password)
- ✅ Admin panel base (layout, login, dashboard)

### Этап 2 - Платежи и доставка
- ✅ MockPaymentProvider (полная реализация)
- ✅ SBPPaymentProvider (интерфейс для интеграции с НСПК)
- ✅ Авто-доставка товаров
- ✅ Генерация чеков (текстовый и HTML форматы)

### Этап 3 - Маркетинговые функции
- ✅ Промокоды (создание, валидация, применение)
- ✅ Реферальная программа (0.5% бонус от заказов)
- ✅ Баннеры и акции (расписание, приоритеты, статистика)

### Этап 4 - Полноценная админ-панель
- ✅ CRUD для категорий, товаров, заказов
- ✅ Управление промокодами
- ✅ Управление баннерами
- ✅ Аналитика и статистика
- ✅ Middleware для защиты админ-роутов

## 🛠️ Установка и запуск

### Требования
- Node.js 18+
- Docker и Docker Compose
- Git

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd windsurf-project-2
```

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

Обязательные переменные:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ucshop1?schema=public"
BOT_TOKEN="your_telegram_bot_token"
NEXT_PUBLIC_MINI_APP_URL="https://t.me/your_bot/your_app"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 3. Запуск с Docker Compose (рекомендуется)

```bash
# Запуск PostgreSQL и приложения
docker-compose up -d

# Просмотр логов
docker-compose logs -f
```

Приложение будет доступно по адресу: http://localhost:3000

### 4. Локальная разработка (без Docker)

```bash
# Установка зависимостей
npm install

# Запуск PostgreSQL (если не используется Docker)
docker-compose up -d postgres

# Генерация Prisma Client
npx prisma generate

# Применение миграций
npx prisma migrate dev

# Заполнение базы тестовыми данными
npx prisma db seed

# Запуск development сервера
npm run dev
```

### 5. Запуск Telegram Bot

```bash
# Компиляция и запуск бота
cd bot
npm install
npx ts-node src/index.ts
```

Или через Docker Compose (если настроено):
```bash
docker-compose up bot
```

## 📁 Структура проекта

```
windsurf-project-2/
├── app/                      # Next.js App Router
│   ├── (mini-app)/          # Telegram Mini App
│   │   ├── layout.tsx       # Layout Mini App
│   │   ├── page.tsx         # Главная страница
│   │   ├── categories/      # Категории
│   │   ├── category/[slug]/ # Страница категории
│   │   ├── product/[slug]/  # Страница товара
│   │   ├── checkout/        # Оформление заказа
│   │   ├── orders/          # История заказов
│   │   ├── profile/         # Профиль пользователя
│   │   └── faq/             # FAQ
│   ├── (admin)/             # Admin Panel
│   │   ├── layout.tsx       # Layout админки
│   │   ├── login/           # Страница входа
│   │   ├── page.tsx         # Dashboard
│   │   ├── orders/          # Управление заказами
│   │   └── products/        # Управление товарами
│   ├── api/                 # API Routes
│   │   ├── auth/            # Auth endpoints
│   │   ├── categories/      # Categories API
│   │   ├── products/        # Products API
│   │   ├── orders/          # Orders API
│   │   └── banners/         # Banners API
│   ├── globals.css          # Глобальные стили
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── bot/                     # Telegram Bot
│   ├── src/
│   │   └── index.ts         # Main bot file
│   └── lib/
│       └── prisma.ts        # Prisma client for bot
├── components/              # React компоненты
│   └── ui/                  # UI компоненты (shadcn/ui)
├── db/                      # Database
│   ├── prisma/
│   │   └── schema.prisma    # Prisma schema
│   └── seed.ts              # Seed script
├── lib/                     # Utility libraries
│   ├── auth.ts              # Auth functions
│   └── prisma.ts            # Prisma client
├── shared/                  # Shared code
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   └── constants/           # Constants
├── server/                  # Server-side code
│   └── types/               # Server types
├── docker-compose.yml       # Docker Compose config
├── Dockerfile               # Docker image
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
└── .env.example             # Environment variables template
```

## 🔐 Доступы для тестирования

### Admin Panel
- URL: http://localhost:3000/admin
- Email: admin@ucshop1.ru
- Пароль: admin123

### Telegram Bot
- Создайте бота через [@BotFather](https://t.me/botfather)
- Получите токен и добавьте в `.env`
- Настройте Mini App через [@BotFather] -> /newapp

## 📊 База данных

### Модели данных
- **User** - Пользователи Mini App
- **Admin** - Администраторы
- **Category** - Категории товаров
- **Product** - Товары
- **ProductVariant** - Варианты товаров (цены, номиналы)
- **Order** - Заказы
- **OrderItem** - Позиции в заказе
- **Payment** - Платежи
- **Banner** - Баннеры/акции
- **Settings** - Настройки приложения
- **AuditLog** - Логи действий

### Seed данные
Скрипт `db/seed.ts` создаёт:
- 8 категорий товаров
- 20+ продуктов с вариантами
- 3 баннера
- Тестового пользователя
- Тестового администратора
- Тестовые заказы

## 🎨 Дизайн

Проект использует премиальный геймерский дизайн с:
- Тёмная тема
- Неоновые акценты (cyan, purple, green)
- Glassmorphism эффекты
- Анимации и переходы
- Mobile-first подход

## 📝 API Endpoints

### Categories
- `GET /api/categories` - Получить все категории

### Products
- `GET /api/products` - Получить товары (с фильтрами)
- `GET /api/products/[slug]` - Получить товар по slug

### Orders
- `GET /api/orders?userId=xxx` - Получить заказы пользователя
- `POST /api/orders` - Создать заказ
- `GET /api/orders/[id]` - Получить заказ по ID

### Payments
- `POST /api/payments/create` - Создать платеж
- `GET /api/payments/[paymentId]/status` - Проверить статус платежа
- `POST /api/payments/webhook` - Обработка webhook

### Delivery
- `POST /api/delivery/deliver` - Доставить товар
- `POST /api/delivery/order/[orderId]/auto-deliver` - Авто-доставка заказа

### Receipts
- `GET /api/receipts/[orderId]` - Получить чек заказа

### Promo Codes
- `POST /api/promocodes/validate` - Валидация промокода
- `POST /api/promocodes/apply` - Применение промокода к заказу

### Referral
- `POST /api/referral/apply` - Применение реферального кода
- `GET /api/referral/[userId]/stats` - Статистика рефералов
- `GET /api/referral/[userId]/referrals` - Список рефералов
- `GET /api/referral/[userId]/transactions` - История транзакций

### Banners
- `GET /api/banners/active` - Получить активные баннеры
- `POST /api/banners/[id]/view` - Регистрация просмотра
- `POST /api/banners/[id]/click` - Регистрация клика

### Auth
- `POST /api/auth/login` - Вход админа
- `POST /api/auth/telegram` - Telegram auth

### Admin - Categories
- `GET /api/admin/categories` - Получить все категории
- `POST /api/admin/categories` - Создать категорию
- `GET /api/admin/categories/[id]` - Получить категорию
- `PUT /api/admin/categories/[id]` - Обновить категорию
- `DELETE /api/admin/categories/[id]` - Удалить категорию

### Admin - Products
- `GET /api/admin/products` - Получить все товары
- `POST /api/admin/products` - Создать товар
- `GET /api/admin/products/[id]` - Получить товар
- `PUT /api/admin/products/[id]` - Обновить товар
- `DELETE /api/admin/products/[id]` - Удалить товар

### Admin - Orders
- `GET /api/admin/orders` - Получить все заказы
- `GET /api/admin/orders/[id]` - Получить заказ
- `PUT /api/admin/orders/[id]` - Обновить статус заказа

### Admin - Promo Codes
- `GET /api/admin/promocodes` - Получить все промокоды
- `POST /api/admin/promocodes` - Создать промокод
- `PUT /api/admin/promocodes/[id]` - Обновить промокод
- `DELETE /api/admin/promocodes/[id]` - Удалить промокод

### Admin - Banners
- `GET /api/admin/banners` - Получить все баннеры
- `POST /api/admin/banners` - Создать баннер
- `PUT /api/admin/banners/[id]` - Обновить баннер
- `DELETE /api/admin/banners/[id]` - Удалить баннер

### Admin - Analytics
- `GET /api/admin/analytics?period=7d` - Получить аналитику (1d, 7d, 30d)

## 🔧 Команды

```bash
# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start

# Prisma команды
npx prisma generate          # Генерация клиента
npx prisma migrate dev       # Создание миграции
npx prisma db push           # Применение schema без миграции
npx prisma db seed           # Заполнение данными
npx prisma studio            # GUI для базы данных

# Линтинг
npm run lint

# Форматирование
npm run format
```

## 🚨 Известные проблемы

Линт-ошибки о missing modules (next, react, @prisma/client и т.д.) исчезнут после установки зависимостей через `npm install`.

## 📄 Лицензия

MIT

## 🤝 Поддержка

Для вопросов и поддержки обращайтесь к разработчику.
