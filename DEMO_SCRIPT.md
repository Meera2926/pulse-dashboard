# Pulse — 3-Minute Demo Video Script & Storyboard

> **Video Title:** Pulse: Real-Time Event Tracking, Attribution & Demand Intelligence  
> **Target Duration:** Exactly 2 minutes 50 seconds – 3 minutes 00 seconds  
> **Target Audience:** Hackathon Judges, Product Leaders, Growth Marketers, Developers  

---

## Production Setup & Recording Guidelines

1. **Resolution:** 1080p (1920x1080) or 4K at 60fps.
2. **Audio:** Clear voiceover with subtle background ambient techno/synth music at 10% volume.
3. **Browser:** Chrome or Arc in full-screen mode at `http://localhost:3000` (press `F11` to hide browser chrome).
4. **Mouse Pointer:** Enable mouse click highlight rings to emphasize UI interactions.

---

## Timed Walkthrough & Voiceover Script

### Act 1: The Hook & The Problem Statement (0:00 - 0:35)

- **On-Screen Visual:**
  - Start on the Pulse Login screen (`/login`).
  - Demonstrate entering credentials or clicking "Quick Demo Login", transitioning smoothly through the middleware into the glassmorphic dashboard (`/`).
  - The live ticker is streaming real-time events across the top; cards glow cyan and purple.
- **Narrator (Spoken):**
  > *"Every day, growth and product teams waste up to thirty percent of their acquisition budgets because they are looking in the rearview mirror. Traditional analytics platforms rely on batch ETL jobs that take twenty-four to forty-eight hours to attribute conversions. By the time you notice an ad campaign is failing or an enterprise account is churning, the damage is already done.*  
  > *Meet **Pulse** — a zero-latency, real-time event intelligence platform that unifies live customer clickstreams, multi-touch attribution, and predictive demand forecasting into a single reactive command center."*

---

### Act 2: Live Ingestion & The Overview Dashboard (0:35 - 1:15)

- **On-Screen Visual:**
  - Hover over the top KPI cards: **Live Active Users**, **Conversion Velocity**, **Channel Efficiency**, and **Predicted Demand**.
  - Point out the **Live Ticker** showing real-time event ingestion (`checkout_completed`, `view_item`, `subscription_renewal`).
  - Toggle the simulation speed control or click **"Simulate Burst"** in the top bar to trigger a sudden surge in traffic.
  - Show confetti and the conversion chart dynamically adjusting to the burst.
- **Narrator (Spoken):**
  > *"Right from the home dashboard, Pulse provides a pulse on your entire customer ecosystem. Powered by a high-throughput reactive simulation engine built with Zustand, events from six major acquisition channels stream into the system with zero latency.*  
  > *Notice the dynamic KPI cards updating in real time. When we trigger a simulated traffic burst — like a flash sale or product launch — the charts and live tickers react instantaneously without a page refresh or server lag."*

---

### Act 3: Channel Attribution & Demand Forecasting (1:15 - 1:55)

- **On-Screen Visual:**
  - Click on the **Channels** tab (`/channels`) in the sidebar.
  - Hover over the **Channel Radar** and **Doughnut Distribution** charts.
  - Navigate to **Demand Forecast** (`/demand`).
  - Move the cursor along the **Demand Waveform** showing historical vs. predicted 24-hour load and upper/lower confidence bounds.
- **Narrator (Spoken):**
  > *"Next, let's explore channel performance. Rather than guessing which touchpoint drove the sale, Pulse calculates live cross-channel attribution. Our radar diagram cross-compares volume against conversion velocity across Meta Ads, Organic Search, TikTok, and Direct traffic.*  
  > *In the Demand tab, our predictive wave algorithm computes Fourier-smoothed future demand trajectories. Revenue teams can project server loads and campaign budgets with ninety-five percent statistical confidence envelopes."*

---

### Act 4: Deep-Dive Heatmap & Customer Churn Radar (1:55 - 2:35)

- **On-Screen Visual:**
  - Click on **Heatmap** (`/heatmap`).
  - Show the interactive day-of-week vs. hour-of-day conversion intensity matrix.
  - Click on **Customers** (`/customers`).
  - Filter by "At Risk" churn status. Click an individual customer card to view their sentiment history and decreasing interaction frequency.
- **Narrator (Spoken):**
  > *"For product leaders, our Heatmap reveals high-affinity customer conversion windows, showing exactly when and where users take high-value actions.*  
  > *And here in the Customer Health module is our proactive churn radar. Instead of discovering cancellations post-mortem, Pulse evaluates decaying event cadence and sentiment scores, alerting your success team fourteen days before an account considers leaving."*

---

### Act 5: Architecture & Hand-in Wrap-up (2:35 - 3:00)

- **On-Screen Visual:**
  - Navigate to **Events** (`/events`) to show the raw high-speed event telemetry stream with pause/resume controls.
  - Briefly flip to the code in VS Code showing Next.js 16 App Router, TypeScript types, and Tailwind CSS v4 styling.
  - Return to the Pulse dashboard with the particle background animated.
- **Narrator (Spoken):**
  > *"Pulse is engineered from the ground up with Next.js 16 Turbopack, Tailwind CSS, Recharts, and Framer Motion for full sixty frames-per-second performance. It includes complete Docker configuration, full unit tests, an MIT license, and is ready for production deployment.*  
  > *Check out the public repository on GitHub and try Pulse live today. Thank you!"*

---

## Quick Submission Checklist

- [x] Video length checked (under 3:00)
- [x] Audio balanced and clear
- [x] 1080p 60fps export format (`.mp4` / `.webm`)
- [x] Uploaded to YouTube (Unlisted), Loom, or Vimeo
- [x] Link added to `README.md`
