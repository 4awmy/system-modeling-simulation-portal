# AAST Computer Graphics Learning Portal

A interactive web portal built for **Dr. Gouda Ismail's Computer Graphics course** at the Arab Academy for Science and Technology (AAST). The portal is designed with official AAST academic branding (Navy and Gold) to help students visually learn and trace fundamental graphics algorithms.

---

## 🚀 Key Features

1.  **Lectures & Sheets View**: Direct access to Weeks 1–11 slides and Sheets I–IV with detailed concepts summaries and formulas.
2.  **Interactive Algorithm Visualizers**:
    *   **Line Drawing**: DDA vs. Bresenham comparisons side-by-side with step-by-step trace tables and interactive pixel grids.
    *   **Circle Drawing**: Midpoint circle algorithm with 8-way symmetry tracing.
    *   **Ellipse Drawing**: Midpoint ellipse region-by-region visualizer.
    *   **Region Filling**: 16x16 canvas with Boundary Fill & Flood Fill (4-connected vs. 8-connected) and a real-time recursion stack trace display.
3.  **Practice Zone (Socratic Helper)**: Validates student calculations in trace tables cell-by-cell (green/red background) and provides adaptive hints without revealing direct answers immediately.
4.  **AI Explainer Simulator**: Demonstrates how an AI agent chatbot provides explanations and hints using Socratic dialog aligned with course materials.
5.  **Instructor Admin Panel**: A password-protected (`aast2026`) dashboard allowing Dr. Gouda to post announcements, modify lecture outlines, update exercises, and save them.

---

## 🛠️ Getting Started (Local Development)

To run the application locally on your computer:

1.  Open your terminal inside the `portal` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the local address in your browser (usually `http://localhost:5173`).

---

## 📝 Content Editing & Persistence

The portal supports two saving mechanisms:

### A. Development Mode (Local Saving)
When running `npm run dev` locally, the portal connects to a **Vite server middleware API**. When Dr. Gouda edits announcements, lectures, or exercises and clicks **"Save"**, the app writes the changes directly back to the database JSON files inside `src/data/` on the hard drive.

### B. Production Mode (GitHub Pages Saving)
GitHub Pages is a static hosting platform with no running database. When hosted on GitHub Pages:
1.  Instructor edits will save to the browser's `localStorage` for immediate preview.
2.  To make these changes permanent for all students, click the **"Download [file].json"** buttons on the dashboard.
3.  Replace the corresponding file inside `src/data/` in your source code folder.
4.  Commit and push the file to GitHub. The website will rebuild and deploy automatically!

---

## 🌐 Deploying to GitHub Pages

We have provided a automated deployment pipeline using GitHub Actions.

### Setup Instructions:
1.  Initialize a Git repository in the parent folder or inside `portal`.
2.  Push the code to GitHub.
3.  Go to your GitHub repository **Settings** -> **Pages**.
4.  Under **Build and deployment**, select **GitHub Actions** as the source.
5.  Pushing code to the `main` branch will automatically trigger the workflow in `.github/workflows/deploy.yml` which builds and deploys the site!
