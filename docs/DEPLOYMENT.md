# Развёртывание клиентской части (паттерн «Заместитель»)

Клиентское приложение обращается к API **только через** `ApiServiceProxy` (`src/patterns/proxy/`), а не напрямую через `fetch`. Это реализация паттерна **Proxy (Заместитель)** для развёртывания: единая точка доступа, кэш GET-запросов, логирование.

## Локальная разработка

```bash
npm install
cp .env.example .env
# Заполните VITE_YANDEX_MAPS_API_KEY
npm run dev
```

Vite проксирует `/api` и `/media` на production-бэкенд (см. `vite.config.js`).

## Production-сборка

```bash
npm run build
npm run preview
```

В `.env` для production:

```env
VITE_API_BASE_URL=https://morent-backend-production.up.railway.app
VITE_YANDEX_MAPS_API_KEY=ваш_ключ
```

## Статический хостинг

После `npm run build` папка `dist/` содержит SPA. Для GitHub Pages / Netlify / Vercel включите fallback на `index.html` для маршрутов React Router.

`ApiServiceProxy` при деплое продолжает работать: `RealApiService` выполняет реальные запросы, прокси добавляет кэш и логи.
