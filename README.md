# AAST Computer Graphics Portal

_Deployed at: 2026-05-22T19:14:50+03:00_

A professional, interactive web portal for Dr. Gouda Ismail's *Computer Graphics* course at the **Arab Academy for Science, Technology and Maritime Transport (AAST)**. Built with React, TypeScript, Vite, and Tailwind CSS.

> **Live site:** [https://4awmy.github.io/computer-graphics-portal/](https://4awmy.github.io/computer-graphics-portal/)

---

## Features

| Section | Description |
|---|---|
| **Lectures & Sheets** | Browse Weeks 1–11 slides and Sheets I–IV with summaries and formula references |
| **Algorithm Visualizers** | Step-through demos for DDA/Bresenham line drawing, midpoint circle/ellipse, and boundary/flood fill with recursion stack traces |
| **Practice Zone** | Socratic helper that validates trace-table entries cell-by-cell with adaptive hints |
| **AI Tutor** | Floating chatbot that explains concepts and guides problem-solving |
| **Instructor Dashboard** | Password-protected admin panel to edit announcements, lecture outlines, and exercises |

---

## Getting Started

```bash
# 1. Enter the portal directory
cd portal

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The Instructor Dashboard's "Save to disk" and "Git Sync" features rely on Vite dev-server middleware (`/api/save`, `/api/git-sync`) and are only available in local development. On the deployed GitHub Pages site, changes persist in the browser's `localStorage` only.

---

## Deployment (GitHub Pages)

The repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that automatically builds and publishes the site on every push to `main`.

### One-time setup

1. Go to **Settings → Pages** in your GitHub repository.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Click **Save** — the workflow will handle the rest.

---

## Project Structure

```
portal/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── components/          # React UI components
│   │   ├── Navigation.tsx
│   │   ├── LecturesView.tsx
│   │   ├── PracticeZone.tsx
│   │   ├── Demos.tsx        # Algorithm visualizers
│   │   ├── AITutorSim.tsx
│   │   └── InstructorDashboard.tsx
│   └── data/                # JSON content (lectures, exercises, announcements)
├── .github/workflows/       # CI/CD pipeline
└── vite.config.ts           # Vite config + dev-server API middleware
```

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool + dev middleware)
- **Tailwind CSS** + **shadcn/ui**
- **Lucide React** (icons)
- **GitHub Actions** (CI/CD to GitHub Pages)

---

## Instructor Access

The dashboard is protected by a password. The default credential is set in the source and should be changed before sharing the portal publicly.

---

## License

MIT License — see `LICENSE` for details.
