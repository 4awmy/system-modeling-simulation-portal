# AAST Computer Graphics Learning Portal

![Instructor Dashboard Mockup](file:///C:/Users/omarh/.gemini/antigravity-cli/brain/de1d9432-c501-497e-ba89-c572b7d1105c/instructor_dashboard_mockup_1779463962442.png)

A premium, interactive web portal for **Dr. Gouda Ismail's Computer Graphics course** at the Arab Academy for Science and Technology (AAST). The portal follows the official AAST branding (deep navy & gold) and showcases modern UI/UX with glassmorphism, vibrant gradients, and smooth micro‑animations.

---

## 🚀 Key Features

1. **Lectures & Sheets Viewer** – Browse weeks 1‑11 slides and Sheets I‑IV with concise summaries and formulas.
2. **Algorithm Visualizers** – Interactive demos for:
   - Line Drawing (DDA vs. Bresenham)
   - Circle Drawing (mid‑point)
   - Ellipse Drawing (mid‑point)
   - Region Filling (boundary & flood fill, 4‑/8‑connected) with live recursion stack trace.
3. **Practice Zone (Socratic Helper)** – Validate trace‑table entries cell‑by‑cell, providing adaptive hints.
4. **AI Explainer Simulator** – Demonstrates how an AI chatbot can guide students through concepts.
5. **Instructor Admin Panel** – Password‑protected (`aast2026`) dashboard for announcements, lecture outlines, exercises, and data persistence.

---

## 🛠️ Getting Started (Local Development)

```bash
# Clone the repo (you already have it locally)
cd "C:/Users/omarh/OneDrive/Desktop/Uni/Computer Graphics/portal"

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open <http://localhost:5173> in your browser. The instructor dashboard lets you edit JSON data files in `src/data/` directly from the UI.

---

## 📦 Production Build & GitHub Pages Deployment

The repository includes a **GitHub Actions** workflow (`.github/workflows/deploy.yml`) that builds the Vite app and deploys it to GitHub Pages.

### Steps to enable Pages (once‑off)
1. Visit the repository **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Click **Save**. The workflow will automatically publish from the `main` branch.

> ⚠️ The Pages site will be available at `https://4awmy.github.io/computer-graphics-portal/` after the workflow succeeds.

---

## 📂 Project Structure

```
portal/
├─ public/                # static assets (favicon, icons)
├─ src/                   # React source code
│   ├─ components/        # UI components (InstructorDashboard, etc.)
│   └─ data/              # JSON files for lectures, exercises, announcements
├─ .github/workflows/    # GitHub Actions CI/CD
└─ vite.config.ts        # Vite config with middleware APIs
```

---

## 🤝 Contributing

Feel free to fork the repo, open pull requests, or suggest improvements. The project uses **TypeScript**, **React**, **Vite**, **Tailwind CSS**, and **shadcn/ui** for a modern, premium UI.

---

## 📄 License

MIT License – see `LICENSE` for details.
