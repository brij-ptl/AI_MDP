"use client";

import { useCookieConsent } from "@/context/CookieConsentContext";

export default function CookieBanner() {
  const { consent, acceptCookies, declineCookies } = useCookieConsent();

  if (consent) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[92vw] max-w-xl -translate-x-1/2 rounded-2xl border border-border glass-card p-4 shadow-card md:bottom-6">
      <p className="text-sm text-muted">
        We use cookies to track your session, remember your free-trial predictions, and keep you
        signed in securely. By continuing, you agree to our{" "}
        <a href="/cookies" className="text-primary underline">Cookie Policy</a>.
      </p>
      <div className="mt-3 flex gap-3">
        <button
          onClick={acceptCookies}
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-bg"
        >
          Accept
        </button>
        <button
          onClick={declineCookies}
          className="rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-text"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
