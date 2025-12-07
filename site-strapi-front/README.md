# Новостной сайт - Frontend

Frontend приложение для новостного сайта на Vue 3 + Vite.

## Технологии

- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios
- ESLint + Prettier

## Структура проекта

```
src/
  ├── api/          # API клиент для Strapi
  ├── components/   # Переиспользуемые компоненты
  │   ├── articles/    # Компоненты для статей
  │   ├── common/      # Общие компоненты
  │   └── layouts/     # Компоненты макета
  ├── stores/       # Pinia stores (auth, articles, categories)
  ├── types/        # TypeScript типы
  ├── utils/        # Утилиты (JWT, валидация, форматирование)
  ├── views/        # Страницы приложения
  └── router/       # Конфигурация роутера
```

## Установка и запуск

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview
```

### Переменные окружения

Создайте файл `.env`:

```env
VITE_STRAPI_URL=http://localhost:1337
```

## Функциональность

### Аутентификация
- Регистрация пользователей
- Вход в систему
- Хранение JWT токена
- Защита маршрутов

### Статьи
- Просмотр списка статей с пагинацией
- Фильтрация по категориям
- Фильтрация избранных статей
- Сортировка (по дате, популярности)
- Детальный просмотр статьи
- Создание/редактирование статей (для авторизованных)
- Удаление статей (только для редакторов)

### RBAC
- Проверка ролей на клиенте
- Условный рендеринг элементов UI
- Защита маршрутов по ролям

## API Endpoints

Приложение использует следующие endpoints Strapi:

- `GET /api/articles` - список статей
- `GET /api/articles/:id` - детали статьи
- `GET /api/articles/featured` - избранные статьи
- `POST /api/articles` - создание статьи
- `PUT /api/articles/:id` - обновление статьи
- `DELETE /api/articles/:id` - удаление статьи
- `POST /api/articles/:id/publish` - публикация статьи
- `GET /api/categories` - список категорий
- `POST /api/auth/local` - вход
- `POST /api/auth/local/register` - регистрация
- `GET /api/users/me` - текущий пользователь

## Docker

```bash
# Сборка образа
docker build -t news-site-front .

# Запуск контейнера
docker run -p 3000:3000 news-site-front
```

## Линтинг и форматирование

```bash
# Проверка кода
npm run lint

# Форматирование кода
npm run format
```
