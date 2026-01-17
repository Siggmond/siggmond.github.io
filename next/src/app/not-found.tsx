import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Not found</h1>
      <p className="mt-3 text-muted-foreground">The page you’re looking for doesn’t exist.</p>
      <div className="mt-8">
        <Link className="underline" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
