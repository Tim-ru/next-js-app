# DummyJSON Shop

Небольшое тестовое приложение на Next.js с логином через DummyJSON и главной страницей товаров.

Что есть в проекте:

- страница `/login` с авторизацией через `POST /auth/login`
- сохранение сессии в `localStorage`
- главная страница с 12 товарами из публичного API
- `Header` и `Footer`, которые зависят от состояния авторизации
- Docker-сборка для запуска в production-режиме

## Стек

- Next.js 16
- React 19
- TypeScript
- Zustand
- Axios
- SCSS Modules
- ESLint
- Stylelint
- Prettier
- Docker

## Требования

- Node.js 20+ или 22+
- npm 10+
- доступ в интернет к `https://dummyjson.com`

## Запуск локально

```bash
npm install
npm run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

Тестовые данные для входа, например:

```text
username: emilys
password: emilyspass
```

## Docker

Собрать образ:

```bash
docker build -t dummyjson-shop .
```

Запустить контейнер:

```bash
docker run --rm -p 3000:3000 dummyjson-shop
```

После запуска приложение будет доступно на [http://localhost:3000](http://localhost:3000).

## Проверки

```bash
npm run lint
npm run stylelint
npm run format:check
npm run build
```

При необходимости:

```bash
npm run lint:fix
npm run stylelint:fix
npm run format
```

## Структура

```text
src/
  app/
    layout.tsx
    page.tsx
    login/page.tsx
  components/
    layout/
    providers/
  lib/
    axios.ts
  services/
    auth.service.ts
    products.service.ts
  store/
    auth.store.ts
  styles/
  types/
Dockerfile
README.md
next.config.ts
```

## Как это работает

Авторизация:

- после загрузки клиента `AuthProvider` вызывает `initAuth()`
- сохраненная сессия читается из `localStorage`
- если токен найден, состояние восстанавливается в Zustand-store
- после логина токен передается в Axios через `setAccessToken()`
- `logout()` очищает store и удаляет сохраненную сессию

Товары:

- главная страница загружает список через `productsService.getProducts({ limit: 12 })`
- для каталога есть состояния загрузки, ошибки и успешного ответа
- кнопка `Add to cart` показывается только авторизованному пользователю

## Что можно улучшить

- перенести авторизацию с `localStorage` на cookie/session-based схему
- добавить refresh token flow в рабочий сценарий
- вынести `API_BASE_URL` в переменные окружения
- добавить тесты на основные пользовательские сценарии
- настроить CI со сборкой и проверками

## Примечания

- `.env` для текущего сценария не нужен
- в Docker используется `output: "standalone"`
- внешние картинки разрешены в `next.config.ts` только для доменов DummyJSON
