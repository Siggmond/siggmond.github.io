This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Static export (GitHub Pages)

This project is configured for **static export** via `output: "export"` in `next.config.ts`.

- No server runtime.
- No API routes.

### Environment variables

These are **build-time** variables (set them in GitHub Actions and/or your local shell before running `npm run build`).

- `NEXT_PUBLIC_CONTACT_FORM_ACTION`
  - Your external form handler endpoint (Formspree/Basin/etc.).
  - Until configured, the contact form will show an error and direct users to the mailto fallback.
- `NEXT_PUBLIC_BASE_PATH`
  - Optional override for GitHub Pages project sites.
  - Example for `https://<user>.github.io/<repo>/`: set to `/<repo>`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub Pages deploy

The repo includes a workflow at `.github/workflows/gh-pages.yml` that:

- installs dependencies in `next/`
- runs `npm run build` (which produces `next/out/`)
- deploys `next/out/` to GitHub Pages
