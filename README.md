# ClassroomX‑Style Learning Portal

![Instructor Dashboard](file:///C:/Users/omarh/.gemini/antigravity-cli/brain/de1d9432-c501-497e-ba89-c572b7d1105c/instructor_dashboard_mockup_1779463962442.png)

A **premium, interactive web portal** for Dr. Gouda Ismail’s *Computer Graphics* course at the Arab Academy for Science and Technology (AAST). The UI follows the modern *ClassroomX* aesthetic – dark glass‑morphism, vibrant gradients, and smooth micro‑animations – giving students a sleek, immersive learning experience.

---

## 📚 Overview

- **Lectures & Sheets** – Browse weeks 1‑11 slides and Sheets I‑IV with concise summaries and formula tables.
- **Algorithm Visualizers** – Interactive demos for line drawing (DDA/Bresenham), circle/ellipse midpoint algorithms, and region‑filling (boundary & flood fill) with live recursion stack traces.
- **Practice Zone** – Socratic helper validates trace‑table entries cell‑by‑cell, offering adaptive hints.
- **AI Tutor** – Simulated chatbot explains concepts and guides problem‑solving.
- **Instructor Dashboard** – Password‑protected (`aast2026`) admin panel to edit announcements, lecture outlines, and exercises.

---

## 🚀 Getting Started (Local Development)

```bash
# Clone the repo (you already have it locally)
cd "C:/Users/omarh/OneDrive/Desktop/Uni/Computer Graphics/portal"

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open <http://localhost:5173> in your browser. The instructor dashboard lets you edit the JSON data files in `src/data/` directly from the UI.

---

## 📦 Production Build & GitHub Pages Deployment

The repository ships with a **GitHub Actions** workflow (`.github/workflows/deploy.yml`) that builds the Vite app and publishes it to GitHub Pages.

### One‑time Pages setup
1. Navigate to **Settings → Pages** in the GitHub UI.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Click **Save**. The workflow will automatically publish from the `main` branch.

> The live site will be available at `https://4awmy.github.io/computer-graphics-portal/` after the workflow completes.

---

## 🗂️ Project Structure

```
portal/
├─ public/                # static assets (favicon, icons)
├─ src/                   # React source code
│   ├─ components/        # UI components (InstructorDashboard, etc.)
│   └─ data/              # JSON files for lectures, exercises, announcements
├─ .github/workflows/    # GitHub Actions CI/CD pipeline
└─ vite.config.ts        # Vite config with middleware APIs
```

---

## 🤝 Contributing

Feel free to fork, open pull requests, or suggest improvements. The stack uses **TypeScript**, **React**, **Vite**, **Tailwind CSS**, and **shadcn/ui** for a modern, premium UI.

---

## 📄 License

MIT License – see `LICENSE` for details.
