# 📚 Полное руководство установки GDZ AI

## Требования

- **Node.js**: 18+ (скачайте с https://nodejs.org)
- **PostgreSQL**: 12+ (установите с https://www.postgresql.org)
- **OpenAI API ключ**: Получите на https://platform.openai.com

## Шаг 1: Создание базы данных PostgreSQL

```bash
# Откройте PostgreSQL CLI
psql -U postgres

# Создайте новую БД
CREATE DATABASE gdz_ai_db;
CREATE USER gdz_user WITH PASSWORD 'your_strong_password';
ALTER ROLE gdz_user SET client_encoding TO 'utf8';
ALTER ROLE gdz_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE gdz_user SET default_transaction_deferrable TO on;
ALTER ROLE gdz_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE gdz_ai_db TO gdz_user;

# Выход
\q
```

## Шаг 2: Установка Backend

```bash
# Перейдите в директорию backend
cd backend

# Установите зависимости
npm install

# Скопируйте .env файл
cp .env.example .env

# Отредактируйте .env с вашими данными:
# - DATABASE_URL (замените user, password, localhost если нужно)
# - OPENAI_API_KEY
# - JWT_SECRET (генерируйте сильный ключ)
# - JWT_REFRESH_SECRET

# Создайте таблицы в БД
npx prisma migrate dev --name init

# Загрузите начальные данные учебников
npm run prisma:seed

# Запустите backend сервер
npm run dev
```

**Сервер запустится на**: http://localhost:5000

## Шаг 3: Установка Frontend

```bash
# В новом терминале, перейдите в директорию frontend
cd frontend

# Установите зависимости
npm install

# Скопируйте .env файл
cp .env.example .env

# Убедитесь, что VITE_API_URL указывает на backend сервер:
# VITE_API_URL="http://localhost:5000/api"

# Запустите frontend
npm run dev
```

**Приложение откроется на**: http://localhost:5173

## Шаг 4: Проверка работы

1. Откройте http://localhost:5173 в браузере
2. Зарегистрируйтесь (создайте новый аккаунт)
3. Выберите страну и класс
4. Попробуйте функции:
   - "Объяснить тему"
   - "Решить задачу"

## 🔧 Структура файлов

```
gdz-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Конфигурация
│   │   ├── controllers/     # Логика маршрутов
│   │   ├── middleware/      # JWT, валидация
│   │   ├── routes/          # API маршруты
│   │   ├── services/        # Бизнес логика
│   │   └── server.ts        # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Схема БД
│   │   └── seed.ts          # Начальные данные
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── pages/           # Страницы приложения
│   │   ├── services/        # API клиент
│   │   ├── store/           # Zustand (состояние)
│   │   ├── types/           # TypeScript типы
│   │   ├── App.tsx          # Root компонент
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Tailwind CSS
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── docs/                    # Документация
```

## 📡 API endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/refresh` - Обновление токена

### Учебники и темы
- `GET /api/textbooks/countries` - Список стран
- `GET /api/textbooks/grades` - Список классов
- `GET /api/textbooks/subjects` - Список предметов
- `GET /api/textbooks/topics` - Список тем
- `GET /api/textbooks` - Список учебников
- `GET /api/textbooks/:id` - Детали учебника

### ИИ функции
- `POST /api/ai/explain` - Объяснить тему (требует JWT)
- `POST /api/ai/solve` - Решить задачу (требует JWT)
- `GET /api/ai/history` - История запросов (требует JWT)

### Профиль пользователя
- `GET /api/user/profile` - Получить профиль (требует JWT)
- `PUT /api/user/profile` - Обновить профиль (требует JWT)
- `GET /api/user/history` - Получить историю (требует JWT)
- `GET /api/user/saved-items` - Получить избранное (требует JWT)
- `POST /api/user/saved-items` - Добавить в избранное (требует JWT)
- `DELETE /api/user/saved-items/:id` - Удалить из избранного (требует JWT)

## 🗄️ Схема базы данных

### Основные таблицы:

**users** - Пользователи
- id (CUID)
- email (UNIQUE)
- username (UNIQUE)
- passwordHash
- firstName, lastName
- avatar
- createdAt, updatedAt

**countries** - Страны
- id (CUID)
- name, code

**grades** - Классы (1-11)
- id (CUID)
- level (UNIQUE, 1-11)
- name

**subjects** - Предметы
- id (CUID)
- name, code
- gradeId, countryId

**topics** - Темы
- id (CUID)
- title, description
- order
- subjectId

**textbooks** - Учебники
- id (CUID)
- title, author, publisher, year
- isbn (UNIQUE)
- countryId, gradeId, subjectId

**chapters** - Главы
- id (CUID)
- title, number, content
- textbookId

**explanations** - Объяснения от ИИ
- id (CUID)
- topicId (optional)
- question, answer
- tokens_used
- userId
- createdAt

**chat_messages** - История чатов
- id (CUID)
- role (user/assistant)
- content
- imageUrl
- userId
- explanationId
- createdAt

**saved_items** - Избранные
- id (CUID)
- type, itemId
- userId, textbookId
- createdAt

## 🔐 Безопасность

1. **JWT Токены**: Все защищенные маршруты требуют JWT токена в заголовке
2. **Хеширование паролей**: bcryptjs для безопасного хранения паролей
3. **Rate limiting**: Защита от spam (100 запросов за 15 минут)
4. **Валидация input**: Все данные проверяются на backend
5. **CORS**: Настроено для вашего frontend домена

## 🚀 Деплой

### На Vercel (Frontend)

```bash
cd frontend
vercel
```

### На Railway.app (Backend)

1. Создайте аккаунт на https://railway.app
2. Подключите GitHub репозиторий
3. Установите переменные окружения
4. Откройте http://your-domain.railway.app

## 📝 Лицензия

MIT

## ❓ Помощь и поддержка

Если у вас возникли проблемы:

1. Проверьте логи backend сервера
2. Убедитесь, что PostgreSQL запущен
3. Проверьте OPENAI_API_KEY в .env
4. Очистите кэш браузера (Ctrl+Shift+Delete)
5. Перезагрузите сервер