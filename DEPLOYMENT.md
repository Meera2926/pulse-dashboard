# Pulse — Deployment Instructions & Run Guide

This guide outlines how to run, test, build, and deploy the **Pulse** real-time analytics dashboard across local development, Docker containers, Vercel, and self-hosted environments.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+), `yarn`, or `pnpm`
- **Git**: Installed and configured
- **Optional**: Docker & Docker Compose for containerized execution

---

## 2. Local Development Run Guide

### Step 1: Clone Repository & Navigate to Directory
```bash
git clone https://github.com/Meera2926/pulse-dashboard.git
cd pulse-dashboard
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

The application will launch with Turbopack at:
👉 **`http://localhost:3000`**

### Step 4: Login & Authentication
- Pulse includes an authentication route guard.
- When visiting `http://localhost:3000`, if not authenticated, you will be redirected to `/login`.
- Click **"Quick Demo Login"** or enter any email/password to enter the platform.

---

## 3. Production Build & Local Validation

To test the optimized production bundle locally:

```bash
# 1. Build optimized bundle
npm run build

# 2. Run the production server
npm run start
```

The production server will listen on port `3000` with optimal static page delivery and caching.

---

## 4. Docker Deployment

### Building & Running with Docker

Pulse includes a standalone container build.

```bash
# Build the Docker image
docker build -t pulse-dashboard:latest .

# Run the container mapping port 3000
docker run -d -p 3000:3000 --name pulse-app pulse-dashboard:latest
```

Visit `http://localhost:3000`.

### Using Docker Compose
Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  pulse:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

Run with:
```bash
docker compose up -d
```

---

## 5. One-Click Cloud Deployment (Vercel)

Pulse is built natively on Next.js 16 and is 100% optimized for zero-config deployment on Vercel:

1. Push your code to GitHub (see Section 7).
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the `pulse-dashboard` repository.
4. Framework Preset will automatically detect **Next.js**.
5. Click **Deploy**.
6. Your live URL will be active within ~60 seconds (e.g., `https://pulse-dashboard.vercel.app`).

---

## 6. PM2 Self-Hosted VM Deployment (Ubuntu / Debian / AWS EC2)

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Build the application
npm run build

# 3. Start with PM2 process manager
pm2 start npm --name "pulse" -- start

# 4. Save PM2 startup list
pm2 save
pm2 startup
```

---

## 7. Hand-in Deliverables Summary

| Item | Location in Repo | Format |
| :--- | :--- | :--- |
| **Problem Statement** | `PROBLEM_STATEMENT.md` | Markdown |
| **Pitch Deck (PowerPoint)** | `Pulse_Pitch_Deck.pptx` | Microsoft PowerPoint (.pptx) |
| **Pitch Deck (Web & PDF)** | `PITCH_DECK.html` | Interactive Slide Deck (Print to PDF) |
| **3-Min Demo Script** | `DEMO_SCRIPT.md` | Storyboard & Timed Transcript |
| **Clean Documentation** | `README.md` | Markdown with badges & architecture |
| **Run & Deployment Guide**| `DEPLOYMENT.md` | Markdown |
| **Licence** | `LICENSE` | MIT License |
