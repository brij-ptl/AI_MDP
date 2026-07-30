import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import { TrialProvider } from "@/context/TrialContext";
import CookieBanner from "@/components/common/CookieBanner";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Nidaan+ — Predict Disease Before Symptoms Become Serious",
  description:
    "Clinical-grade AI-powered multi-disease prediction and triage platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <CookieConsentProvider>
            <TrialProvider>
              <AuthProvider>
                {children}
                <CookieBanner />
              </AuthProvider>
            </TrialProvider>
          </CookieConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
