<div align="center">

# 📐 AAST System Modeling & Simulation Portal

### Interactive Learning Portal for Dr. Gouda Ismail's System Modeling & Simulation Course

*Built for the Arab Academy for Science, Technology & Maritime Transport (AAST)*

---

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-181717?style=for-the-badge&logo=github&logoColor=white)](https://4awmy.github.io/system-modeling-simulation-portal/)
[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Portal-success?style=for-the-badge)](https://4awmy.github.io/system-modeling-simulation-portal/)

</div>

---

## 📖 About

The **AAST System Modeling & Simulation Learning Portal** is a comprehensive, interactive educational platform designed to support college students throughout Dr. Gouda Ismail's System Modeling & Simulation course. It integrates complete word-for-word course curriculum readings (Weeks 1-13) with interactive simulation labs, step-by-step trace tables, solved practice problems, and an active AI teaching assistant.

The portal features a **password-protected Instructor Dashboard** that allows the instructor to publish announcements, customize syllabus details, modify exercises, and trigger Git commits directly from the browser during local development.

> 🌐 **Live Deployed Site:** [https://4awmy.github.io/system-modeling-simulation-portal/](https://4awmy.github.io/system-modeling-simulation-portal/)

---

## 📸 Portal Interface

*   **Lectures & Reading Rooms**: Access verified, word-for-word slide materials, key definitions, and academic warnings (e.g. lead time alignment, blocking vs starving rules).
*   **Practice Zone**: Work out manual trace tables for single-server queues, inventory policies, and discrete random number mappings with cell-by-cell validation.
*   **RNG & DES Playgrounds**: Advance simulation clocks, seed congruential generators, and watch Monte Carlo empirical rates converge in real-time.

---

## ✨ Features

### 📚 Lectures & Sheets

| Feature | Description |
|---------|-------------|
| **Weekly Slides** | Complete Weeks 1–13 textbook and slide reading transcripts |
| **Outcomes & Targets** | Concise learning objectives card matrix for each week |
| **Warnings & Constraints** | Inline banners highlights for common trace pitfalls (such as off-by-one departures) |
| **Solved Problems** | Accordion system containing step-by-step math computation and answers |

---

### 🖥️ Simulation Visualizers & Laboratories

| Lab Playground | Description |
|----------------|-------------|
| **LCG Generator** | Linear Congruential generator testing Hull-Dobell period conditions |
| **Mid-Square Generator** | 4-digit seed RNG highlighting middle square selection and degeneration collapses |
| **Monte Carlo coin & demand** | Empirical relative frequency convergence visualizer (Law of Large Numbers) |
| **Single-Server Queue (M/M/1)** | Step-by-step trace showing arrival, start, waiting, departure, and utilization |
| **Inventory Replenishment (RP, Q)** | Trace logs mapping lead times, daily demand, order releases, and stock levels |
| **Two-Stage Assembly Line** | Tandem Bob & Ray process flow demonstrating queue starvation and blocking states |
| **Repairman Queuing** | Finite machine breakdown loop comparing cost-benefit tradeoffs for 1 vs 2 repairmen |
| **Clock Scan Mechanics** | Compare event scan priority lists vs periodic scans side-by-side |

---

### 🧩 Practice Zone

| Feature | Description |
|---------|-------------|
| **Trace Table Exercises** | Fill-in-the-blank exercises where students complete simulation trace tables |
| **Socratic Validation** | Instant cell-by-cell checks that correct students as they calculate |
| **Interactive Hints** | Adaptive tips pointing to underlying formulas instead of direct solutions |

---

### 🤖 AI Tutor

| Feature | Description |
|---------|-------------|
| **Floating Sidebar Chat** | Non-disruptive chatbot widget available on all views |
| **Concept Explanations** | Explains simulation structures, distributions, and steady-states |

---

### 🛡️ Instructor Dashboard

| Feature | Description |
|---------|-------------|
| **Announcement Editor** | Pin, post, and remove syllabus announcements |
| **Database Editor** | Live edit exercises, lectures, and schemas |
| **Git Push Sync** | Local middleware that writes updates to disk and commits to Git |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      React SPA (Vite)                    │
│                                                          │
│  ┌─────────────────────────┐   ┌──────────────┐          │
│  │  EnhancedCurriculumView  │   │  PracticeZone│          │
│  │  (Weeks 1-13 Readings)  │   │  (Exercises) │          │
│  └─────────────────────────┘   └──────────────┘          │
│                                                          │
│  ┌─────────────────────────┐   ┌──────────────────────┐  │
│  │  CurriculumDemoWrapper  │   │  InstructorDashboard │  │
│  │  (Interactive Labs/DES) │   │  (Protected Editor)  │  │
│  └─────────────────────────┘   └──────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  AITutorSim — Floating global chatbot widget     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  State: React useState + localStorage persistence        │
└──────────────────────────────────────────────────────────┘
                          │
          ┌───────────────▼───────────────┐
          │  src/data/ (JSON & TS)        │
          │  curriculum-enhanced-w1.ts    │
          │  curriculum-enhanced-w2-w13.ts│
          │  lectures-enhanced.ts         │
          └───────────────────────────────┘
                          │
          ┌───────────────▼───────────────┐
          │  Vite Dev Middleware (local)   │
          │  /api/save  → writes JSON     │
          │  /api/git-sync → git push     │
          └───────────────────────────────┘
```

---

## 🛠️ Tech Stack

*   **Framework**: React 19
*   **Language**: TypeScript 6
*   **Build Tool**: Vite 8
*   **Styling**: Tailwind CSS 4 + custom glassmorphic utilities
*   **Icons**: Lucide React
*   **Deployment**: GitHub Actions + GitHub Pages CI/CD pipeline

---

## 🚀 Quick Start

### Prerequisites

*   Node.js 20+
*   npm

### 1. Clone the Repository

```bash
git clone https://github.com/4awmy/system-modeling-simulation-portal.git
cd system-modeling-simulation-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build

```bash
npm run build
```

Output bundle goes to `dist/` — ready to deploy.

---

## 🌐 Deployment (GitHub Pages)

The repository includes a GitHub Actions pipeline at `.github/workflows/deploy.yml` that automatically builds and deploys the site to GitHub Pages on every push to the `main` branch.

### Quick Setup:
1.  Go to **Settings → Pages** in your new repository.
2.  Set **Build and deployment → Source** to **GitHub Actions**.
3.  Any push to `main` will build and publish the site.

---

## 👥 Authors & Credits

<div align="center">

| Name | Role |
|------|------|
| **Omar Hossam** | Developer — Architecture, UI, Visualizers |

*Built for:*

**🏛️ Arab Academy for Science, Technology & Maritime Transport (AAST)**
**College of Computing and Information Technology**
**Dr. Gouda Ismail — System Modeling & Simulation**

</div>

---

## 📄 License

MIT License — see `LICENSE` for details.

---

<div align="center">

*Built with ❤️ at AAST · Powered by React, TypeScript, Vite & Tailwind CSS*

</div>
