# NextJS Lucia OAuth Postres Docker

The following is an example implementing Lucia OAuth authentication with postgres.

## Requirements

- Node `v20` or greater
- Pnpm
- Docker
- Discord API Keys - https://discord.com/developers/applications

## Quick Setup

### 1 - Install Dependencies

```bash
# FROM: ./

pnpm install;
```

### 2 - Set Environment Variables

Make sure to get `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` from [https://discord.com/developers/applications](https://discord.com/developers/applications).

Make sure to set your `Redirect` to following in discord, found in `https://discord.com/developers/applications/<YOUR_DISCORD_CLIENT_ID>/oauth2`.

```
http://localhost:3000/api/auth/discord/callback
```

And then fill in the information for the environment variables copy:

```bash
# FROM: ./

cp .env.example .env;
```

### 3 - Start Database

```bash
# FROM: ./

pnpm db:up;
```

### 4 - Generate Local Database

```bash
# FROM: ./

pnpm db:gen;
```

### 5 - Push Database Changes

```bash
# FROM: ./

pnpm db:push;
```

### 6 - Run App

```bash
# FROM: ./

pnpm dev;

# [Expected Output]:
#   ▲ Next.js 14.2.3
#   - Local:        http://localhost:3000
#   - Environments: .env.local
# 
#  ✓ Starting...
#  ✓ Ready in 1785ms
```

### 7 - Run Drizzle Studio

```bash
# FROM: ./

pnpm db:studio;

# [Expected Output]:
# ...
# Drizzle Studio is up and running on https://local.drizzle.studio
```

### 8 - Destroy Database

```bash
# FROM: ./

pnpm db:down;
```