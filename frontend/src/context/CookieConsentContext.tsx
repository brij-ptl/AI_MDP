"use client";

import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

interface CookieCtx {
  consent: "accepted" | "declined" | null;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const CookieConsentContext = createContext<CookieCtx>({
  consent: null,
  acceptCookies: () => {},
  declineCookies: () => {},
});

/**
 * Tracks visitor consent + assigns an anonymous tracking id cookie on every
 * new sign-in, used by the backend to correlate free-trial usage per device.
 */
export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);

  useEffect(() => {
    const existing = Cookies.get("nidaan_consent") as "accepted" | "declined" | undefined;
    setConsent(existing ?? null);

    if (!Cookies.get("nidaan_visitor_id")) {
      const id = crypto.randomUUID();
      Cookies.set("nidaan_visitor_id", id, { expires: 365 });
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set("nidaan_consent", "accepted", { expires: 365 });
    setConsent("accepted");
  };
  const declineCookies = () => {
    Cookies.set("nidaan_consent", "declined", { expires: 365 });
    setConsent("declined");
  };

  return (
    <CookieConsentContext.Provider value={{ consent, acceptCookies, declineCookies }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export const useCookieConsent = () => useContext(CookieConsentContext);
