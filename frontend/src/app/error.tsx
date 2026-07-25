"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-center px-6">
      <h1 className="font-display text-3xl font-bold text-text">Something went wrong</h1>
      <p className="max-w-md text-muted">
        Our AI engine hit an unexpected snag processing your request. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-bg"
      >
        Try again
      </button>
    </div>
  );
}
