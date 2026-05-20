# Morent — каршеринг (клиент)

React + Vite. Бэкенд: [morent-backend](https://github.com/w1lqA/morent-backend/).

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

## Паттерны на клиенте

| Паттерн | Папка |
|---------|--------|
| **Заместитель (Proxy)** | `src/patterns/proxy/` |
| **Компоновщик (Composite)** | `src/patterns/composite/` |
| **Итератор (Iterator)** | `src/patterns/iterator/` |

Диаграмма классов: [`docs/class-diagram.puml`](docs/class-diagram.puml).

Развёртывание: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
