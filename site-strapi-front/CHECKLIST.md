# Чек-лист проверки Frontend

## 1. Установка зависимостей

```bash
cd site-strapi-front
npm install
```

## 2. Проверка структуры проекта

Убедитесь, что все файлы на месте:

### API клиент
- ✅ `src/api/strapi.ts` - базовый клиент
- ✅ `src/api/auth.ts` - аутентификация
- ✅ `src/api/articles.ts` - работа со статьями
- ✅ `src/api/categories.ts` - работа с категориями

### Компоненты
- ✅ `src/components/layouts/AppLayout.vue`
- ✅ `src/components/layouts/AppHeader.vue`
- ✅ `src/components/layouts/AppFooter.vue`
- ✅ `src/components/articles/ArticleCard.vue`
- ✅ `src/components/articles/Pagination.vue`
- ✅ `src/components/articles/CategoryFilter.vue`
- ✅ `src/components/common/ConfirmDialog.vue`
- ✅ `src/components/common/LoadingSpinner.vue`

### Страницы
- ✅ `src/views/HomeView.vue`
- ✅ `src/views/ArticleDetailView.vue`
- ✅ `src/views/LoginView.vue`
- ✅ `src/views/RegisterView.vue`
- ✅ `src/views/ArticleEditView.vue`

### Stores
- ✅ `src/stores/auth.ts`
- ✅ `src/stores/articles.ts`
- ✅ `src/stores/categories.ts`

### Утилиты
- ✅ `src/utils/rbac.ts`
- ✅ `src/utils/date.ts`

## 3. Запуск проекта

```bash
npm run dev
```

Приложение должно запуститься на `http://localhost:3000`

## 4. Проверка без Backend (Mock режим)

Так как backend еще не готов, вы увидите ошибки при загрузке данных. Это нормально.

### Что должно работать:
- ✅ Приложение запускается без ошибок
- ✅ Навигация работает (переходы между страницами)
- ✅ Формы отображаются корректно
- ✅ Компоненты рендерятся

### Что не будет работать (до подключения backend):
- ❌ Загрузка статей (будет ошибка 404)
- ❌ Авторизация (будет ошибка 404)
- ❌ Загрузка категорий (будет ошибка 404)

## 5. Проверка с Backend (когда будет готов)

После запуска Strapi backend на `http://localhost:1337`:

1. **Главная страница** (`/`)
   - Должны загружаться статьи
   - Должны работать фильтры
   - Должна работать пагинация

2. **Детальная страница** (`/article/:id`)
   - Должна загружаться статья
   - Должны отображаться все данные

3. **Авторизация** (`/login`, `/register`)
   - Должна работать регистрация
   - Должен работать вход
   - После входа должен сохраняться токен

4. **Создание/редактирование** (`/article/create`, `/article/:id/edit`)
   - Должна работать форма
   - Должно сохраняться в backend

5. **RBAC**
   - Кнопка удаления видна только для editor
   - Обычные пользователи не могут удалять

## 6. Проверка линтера

```bash
npm run lint
```

Не должно быть ошибок.

## 7. Проверка типов (TypeScript)

```bash
npm run type-check
```

Не должно быть ошибок типов.

## 8. Сборка для production

```bash
npm run build
```

Должна создаться папка `dist` без ошибок.

## Возможные проблемы

### Проблема: "Cannot find module 'axios'"
**Решение:** Выполните `npm install`

### Проблема: Ошибки TypeScript при импорте .vue файлов
**Решение:** Убедитесь, что `src/env.d.ts` содержит декларацию для .vue файлов

### Проблема: CORS ошибки при запросах к backend
**Решение:** Убедитесь, что в `vite.config.ts` настроен proxy для `/api`

### Проблема: Страницы не загружаются
**Решение:** Проверьте, что все компоненты импортированы правильно в `router/index.ts`






