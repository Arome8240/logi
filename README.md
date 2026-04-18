# Logistics App Monorepo

A monorepo for a logistics application with NestJS backend and React Native mobile app.

## Structure

```
logistics-app/
├── apps/
│   ├── backend/          # NestJS + MongoDB API
│   └── mobile/           # React Native app (to be created)
└── packages/             # Shared packages (optional)
```

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- MongoDB
- React Native development environment

## Setup

1. Install pnpm if you haven't:
```bash
npm install -g pnpm
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the React Native mobile app:
```bash
cd apps
npx @react-native-reusables/cli@latest init
# Follow the prompts and name it "mobile"
```

4. Configure backend environment:
```bash
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with your MongoDB connection string
```

5. Start development:

Backend:
```bash
pnpm backend
```

Mobile:
```bash
pnpm mobile
```

## Available Scripts

- `pnpm backend` - Start backend in development mode
- `pnpm mobile` - Start React Native metro bundler
