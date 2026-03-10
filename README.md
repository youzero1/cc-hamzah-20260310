# cc - Social Calculator

A fully functional calculator with a social media-inspired design aesthetic, built with Next.js, TypeScript, and SQLite.

## Features

- 🧮 Full arithmetic calculator (add, subtract, multiply, divide)
- 📜 Persistent calculation history via SQLite
- 🌙 Dark/Light theme toggle
- 📋 Share calculations to clipboard
- 📱 Responsive mobile-friendly design
- 🎨 Social media feed-style history

## Getting Started

### Development

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production with Docker

```bash
docker-compose up --build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/cc.sqlite` | Path to SQLite database |
| `NEXT_PUBLIC_APP_NAME` | `cc` | App name displayed in header |
| `NODE_ENV` | `development` | Node environment |

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TypeORM** - Database ORM
- **better-sqlite3** - SQLite driver
- **Tailwind CSS** - Styling
