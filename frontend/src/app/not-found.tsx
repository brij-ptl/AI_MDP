import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="err-404-wrap px-6">
      <div className="mx-auto max-w-lg text-center">
        <svg viewBox="0 0 200 140" className="mx-auto mb-4 h-40 w-64 animate-float" aria-hidden>
          <ellipse cx="100" cy="120" rx="70" ry="10" fill="rgb(var(--color-primary) / 0.15)" />
          <circle cx="100" cy="60" r="42" fill="none" stroke="rgb(var(--color-primary))" strokeWidth="3" />
          <path d="M78 60 h16 l6 -18 l10 34 l8 -16 l6 5 h10" fill="none" stroke="rgb(var(--color-secondary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="100" cy="60" r="42" fill="none" stroke="rgb(var(--color-primary))" strokeWidth="1" strokeDasharray="4 6" className="animate-pulseGlow" />
        </svg>

        <h1 className="err-404-num">404</h1>
        <h3 className="mt-2 text-xl font-semibold text-text">Looks like this page took a wrong turn</h3>
        <p className="mt-3 text-muted">
          The page you're looking for doesn't exist, may have moved, or the URL was mistyped.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/">Go to Home</Button>
        </div>
      </div>
    </section>
  );
}
