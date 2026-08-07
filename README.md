# homepage – Interactive 3D Scene

[![Deploy and Release](https://github.com/anngth/homepage/actions/workflows/deploy-and-release.yml/badge.svg)](https://github.com/anngth/homepage/actions/workflows/deploy-and-release.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/homepage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

Interactive 3D scene built with Next.js and React Three Fiber. Clean architecture, modern UI, and smooth animations.

## ✨ Features

- **3D Scene** with React Three Fiber and Drei
- **Responsive** and mobile-friendly controls
- **Dark/Light Theme** via `next-themes`
- **Modern UI** using Tailwind CSS
- **TypeSafe** with strict TypeScript
- **CI/CD** GitHub Actions + Vercel

## 🛠️ Tech Stack

- Next.js 15 (React 19, TypeScript)
- React Three Fiber (@react-three/fiber), Three.js, @react-three/drei
- Tailwind CSS v4
- next-themes
- pnpm, GitHub Actions, Vercel

## 🗂️ Structure

```text
app/            # App router
components/     # UI + 3D components
utils/          # Helpers/utilities (e.g., cn)
public/         # Static assets
scripts/        # Release/CI helpers
.github/        # Workflows
```

## 🎮 Interactions

- Orbit controls, auto-rotation, and momentum-based animation
- Animated 3D letters with color transitions
- Smooth performance and mobile-friendly gestures

## 🚀 Quick Start

```bash
# Prerequisites: Node.js 18+, pnpm

# 1) Clone
git clone <repository-url>
cd homepage

# 2) Install
pnpm install

# 3) Develop
pnpm dev

# 4) Build & Start
pnpm build
pnpm start

# Optional: tag a release
git tag vX.Y.Z && git push origin vX.Y.Z
```

### Scripts

```bash
pnpm dev     # Dev server
pnpm build   # Production build
pnpm start   # Start production
pnpm lint    # Lint
pnpm release # Interactive release
```

## 🔧 Config

- Env: `.env.local` (e.g., `NEXT_PUBLIC_APP_URL=http://localhost:3000`)
- Tailwind: custom colors, animations, dark mode (`tailwind.config.ts`)

## 🚀 Deployment

- Recommended: Vercel
  - Build: `pnpm build`
  - Install: `pnpm install`
  - Output: `.next`
- CI/CD: tag releases to trigger workflow (see Actions)

## 🤝 Contributing

- PRs welcome. Use Conventional Commits.

## 📄 License

MIT — see `LICENSE`.

## 🙏 Acknowledgments

- Next.js, React Three Fiber, Vercel

## 📞 Support

- Open an issue on GitHub

---
