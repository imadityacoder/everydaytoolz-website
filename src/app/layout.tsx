import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tools.replaner.in"),
  title: {
    default: "RePlaner Tools – Free Daily Finance, PDF, Developer & Media Utilities",
    template: "%s | RePlaner Tools",
  },
  description:
    "Fast, zero-latency, private online utilities. Calculate SIP investments, loan EMIs, merge PDFs, transcode video to audio, decode JWTs, and compress images with 100% client-side execution.",
  keywords: [
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
  authors: [{ name: "RePlaner Tools" }],
  openGraph: {
    title: "RePlaner Tools – Free Daily Finance, PDF, Developer & Media Utilities",
    description: "Zero AI cost, 100% browser memory execution, zero login required.",
    url: "https://tools.replaner.in",
    siteName: "RePlaner Tools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RePlaner Tools – Free Daily Finance, PDF, Developer & Media Utilities",
    description: "High performance client-side tools with zero data collection.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
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
