import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://replaner.in"),
  title: {
    default: "EveryDayToolz – 100% Free Online Tools & Calculators (No Login Required)",
    template: "%s | EveryDayToolz",
  },
  description:
    "100% free online utilities with no login required. Fast, private, client-side tools: SIP calculator, loan EMI, PDF merger, video-to-audio converter, JWT studio, image compressor, and password generator.",
  keywords: [
    "100% free online tools",
    "no login required",
    "free tools no signup",
    "free calculators no login",
    "free online tools",
    "sip calculator",
    "emi calculator",
    "pdf merger",
    "jwt decoder",
    "video to mp3",
    "image compressor",
    "tdee calculator",
    "password generator",
    "word counter",
  ],
  authors: [{ name: "EveryDayToolz" }],
  openGraph: {
    title: "EveryDayToolz – 100% Free Online Tools (No Login Required)",
    description: "100% free utilities with no login required. 100% browser memory execution, zero data collection.",
    url: "https://replaner.in",
    siteName: "EveryDayToolz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EveryDayToolz – 100% Free Online Tools (No Login Required)",
    description: "100% free tools with no login required. High performance client-side execution.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "lzGSZts9QP7IYlBqjzOrj3lgbdbYwWSCRrQbBxK8YoU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1128782780487258";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <div className="relative min-h-screen flex flex-col">
            <AppHeader />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </main>
            <Footer />
          </div>
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
