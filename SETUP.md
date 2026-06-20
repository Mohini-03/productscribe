# ProductScribe — Frontend Skeleton


## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Mohini-03/productscribe.git

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Resize the
window down to phone width to confirm there's no horizontal scroll and the
Navbar collapses into a hamburger menu.

## What's here

- `src/components/` — Navbar, Hero, Card, Footer (the 4 required components)
- `src/pages/Home.jsx` — uses all 4 components; Card is rendered 3 times in
  the "How it works" grid
- `src/pages/About.jsx`, `Dashboard.jsx`, `Login.jsx` — each renders Navbar +
  Footer with a placeholder heading and paragraph
- `src/main.jsx` — routes are wired with `react-router-dom`

## Suggested commits for Deliverable 2

Make these as real, separate commits (don't squash) so the history shows
incremental work:

```bash
git add src/components
git commit -m "feat: add Navbar, Hero, Card, and Footer components"

git add src/pages/Home.jsx src/pages/Home.css src/main.jsx
git commit -m "feat: build Home page with Hero and Card grid"

git add src/pages/About.jsx src/pages/Dashboard.jsx src/pages/Login.jsx src/pages/Pages.css
git commit -m "feat: add About, Dashboard, and Login routes"

git add src/index.css
git commit -m "chore: set up global design tokens and base styles"
```

If you tweak something later, use `fix: <what broke>` for bug fixes and
`refactor: <what you reorganized>` for cleanup — avoid messages like
"update" or "wip".



