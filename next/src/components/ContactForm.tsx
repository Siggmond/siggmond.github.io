"use client";

import { useMemo, useState } from "react";

type Props = {
  toEmail: string;
  formAction: string;
};

function buildMailto({
  to,
  name,
  email,
  company,
  topic,
  message,
}: {
  to: string;
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
}) {
  const subjectParts = [topic || "Contact", company ? `@ ${company}` : ""].filter(Boolean);
  const subject = subjectParts.join(" ");

  const lines = [
    name ? `Name: ${name}` : "",
    email ? `Email: ${email}` : "",
    company ? `Company: ${company}` : "",
    topic ? `Role/Topic: ${topic}` : "",
    "",
    message,
  ].filter(Boolean);

  const body = lines.join("\n");
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ toEmail, formAction }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "throttled">("idle");
  const [error, setError] = useState<string>("");

  const mailtoFallbackHref = useMemo(() => {
    return `mailto:${encodeURIComponent(toEmail)}`;
  }, [toEmail]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot
    const website = String(fd.get("website") ?? "").trim();
    if (website) {
      setStatus("success");
      form.reset();
      return;
    }

    // Basic client-side rate limit (best-effort)
    try {
      const key = "contact:last_submit";
      const last = Number(localStorage.getItem(key) || "0");
      const now = Date.now();
      if (Number.isFinite(last) && now - last < 15_000) {
        setStatus("throttled");
        return;
      }
      localStorage.setItem(key, String(now));
    } catch {
      // ignore
    }

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const topic = String(fd.get("topic") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill Name, Email, and Message.");
      return;
    }

    if (!formAction || formAction.includes("example.com")) {
      setStatus("error");
      setError("Contact form endpoint is not configured yet. Use Email instead.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(formAction, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });

      if (!res.ok) {
        setStatus("error");
        setError("Failed to send. Please use Email instead.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Failed to send. Please use Email instead.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-mono tracking-wide text-foreground/70">Name</span>
          <input
            className="rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3 py-2 outline-none focus:border-foreground/30"
            name="name"
            autoComplete="name"
            required
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-mono tracking-wide text-foreground/70">Email</span>
          <input
            className="rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3 py-2 outline-none focus:border-foreground/30"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-mono tracking-wide text-foreground/70">Company (optional)</span>
          <input
            className="rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3 py-2 outline-none focus:border-foreground/30"
            name="company"
            autoComplete="organization"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-mono tracking-wide text-foreground/70">Role / Topic (optional)</span>
          <select
            className="rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3 py-2 outline-none focus:border-foreground/30"
            name="topic"
          >
            <option value="">Select…</option>
            <option value="Hiring">Hiring</option>
            <option value="Collaboration">Collaboration</option>
            <option value="Question">Question</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="md:col-span-2 grid gap-1 text-sm">
          <span className="font-mono tracking-wide text-foreground/70">Message</span>
          <textarea
            className="min-h-[140px] rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3 py-2 outline-none focus:border-foreground/30"
            name="message"
            required
          />
        </label>

        <input
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          name="website"
          aria-hidden="true"
        />
      </div>

      <p className="text-sm text-foreground/60 font-mono">
        Share the role/team and what you’re building—links welcome.
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="submit"
          className="rounded-lg border border-foreground/20 bg-foreground/[0.05] px-4 py-2 font-mono text-sm hover:border-foreground/30"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>

        <a
          className="rounded-lg border border-foreground/15 px-4 py-2 font-mono text-sm text-foreground/80 hover:border-foreground/25"
          href={mailtoFallbackHref}
        >
          Email instead
        </a>

        <a
          className="rounded-lg border border-foreground/15 px-4 py-2 font-mono text-sm text-foreground/50 hover:border-foreground/25"
          href={buildMailto({
            to: toEmail,
            name: "",
            email: "",
            company: "",
            topic: "",
            message: "",
          })}
        >
          Prefill via email client
        </a>
      </div>

      <div className="min-h-[1.5rem] text-sm font-mono">
        {status === "success" ? (
          <span className="text-foreground/70">Sent. I’ll reply within 24–48 hours.</span>
        ) : null}
        {status === "throttled" ? (
          <span className="text-foreground/70">Please wait a few seconds before sending again.</span>
        ) : null}
        {status === "error" ? <span className="text-foreground/70">{error}</span> : null}
      </div>

      <details className="text-sm text-foreground/60">
        <summary className="cursor-pointer">Trouble with the form?</summary>
        <div className="mt-2">
          <a className="underline" href={mailtoFallbackHref}>
            Email {toEmail}
          </a>
        </div>
      </details>
    </form>
  );
}
