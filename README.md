# PrivyTool

Privacy-first online toolkit. Image tools process files entirely in the browser — no upload required.

**Domain:** [privytool.com](https://privytool.com)

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Zustand
- Framer Motion

## What’s live

- Compress (`/tools/image/compress`)
- Resize (`/tools/image/resize`)
- Convert (`/tools/image/convert`)
- History (`/tools/image/history`) — on-device downloads with filter dropdown

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project docs

| Doc | Purpose |
|-----|---------|
| [AGENTS.md](./AGENTS.md) | **Agent handoff** — architecture, conventions, copy-paste prompt |
| [docs/USER_GUIDE.md](./docs/USER_GUIDE.md) | **How to use** — tools & features (printable) |
| Live guide | [privytool.com/guide](https://privytool.com/guide) |
| [docs/TECH_STACK_AND_OPS.md](./docs/TECH_STACK_AND_OPS.md) | **Ops** — Next.js, GoDaddy, Cloudflare DNS/Pages, Google Search Console |
| [docs/BUSINESS_PLAN.md](./docs/BUSINESS_PLAN.md) | Full business, SEO, and technical roadmap |
| [docs/CHECKLIST.md](./docs/CHECKLIST.md) | Done / Pending implementation checklist |

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
