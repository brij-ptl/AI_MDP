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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
