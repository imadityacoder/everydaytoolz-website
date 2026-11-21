import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | EveryDayToolz",
  description:
    "EveryDayToolz Privacy Policy: 100% private in-browser tool execution, zero data collection, no account registration required.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | EveryDayToolz",
    description:
      "EveryDayToolz Privacy Policy: 100% private in-browser tool execution, zero data collection, no account registration required.",
    url: "https://tools.replaner.in/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 sm:py-10">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Tools</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy-First Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground">
          Last updated: November 2026 • Effective immediately
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card/60 border border-border/70 space-y-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Zero File Uploads</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All files (PDFs, videos, images, text) are processed strictly in your local device memory using WebAssembly.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card/60 border border-border/70 space-y-2">
          <div className="p-2 rounded-xl bg-brand-cyan/10 text-brand-cyan w-fit">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No Accounts or Signups</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We never ask for emails, passwords, names, or contact details to access any of our tools.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card/60 border border-border/70 space-y-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No Data Retention</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Because calculations run client-side, we have no servers storing your financial parameters or confidential payloads.
          </p>
        </div>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-8">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
          <p>
            Welcome to EveryDayToolz (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), hosted at{" "}
            <strong className="text-foreground">tools.replaner.in</strong>. We provide deterministic, high-speed,
            browser-based developer, financial, media, and productivity tools. We respect your personal privacy and
            are committed to protecting it through our privacy-by-design architecture.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Client-Side Execution & Zero File Uploads</h2>
          <p>
            Unlike traditional web utilities that upload your sensitive documents, financial metrics, or media to remote
            cloud servers, EveryDayToolz executes operations locally within your web browser using modern WebAssembly
            (WASM), Web Workers, and client-side JavaScript APIs.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>PDF Toolkit:</strong> Pages are merged and split in browser RAM using WebAssembly. No PDF leaves your device.</li>
            <li><strong>Video to Audio:</strong> Transcoded locally with in-browser FFmpeg WASM.</li>
            <li><strong>Image Compressor:</strong> Scaled and re-encoded using native HTML5 Canvas APIs.</li>
            <li><strong>Financial Calculators:</strong> SIP, loan amortization, and tax projections calculate instantaneously on your machine.</li>
            <li><strong>JSON & JWT Studio:</strong> Tokens and JSON trees are decoded and formatted purely in local memory.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Information We Collect</h2>
          <p>
            We do not require user accounts, logins, or authentication. We do not store personal profiles, names, or addresses.
          </p>
          <p>
            Standard non-personally identifiable technical logs (such as IP address, browser user-agent, referring page, and access timestamps)
            may be generated automatically by our hosting infrastructure (Vercel) solely to ensure network security, DDoS prevention,
            and platform availability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Cookies and Advertising (Google AdSense)</h2>
          <p>
            EveryDayToolz displays advertisements served by Google AdSense to support the free operation of this service without paywalls.
          </p>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on our site. Google&apos;s use of advertising cookies enables it
            and its partners to serve ads based on user visits to this site and/or other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Ads Settings
            </a>
            {" "}or via{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              aboutads.info
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Third-Party Analytics and Links</h2>
          <p>
            Our site may contain links to external websites or services (e.g., YouTube thumbnail sources). We do not control and are not
            responsible for the privacy practices or content of third-party websites. We encourage you to review their respective privacy policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">6. Children&apos;s Online Privacy Protection (COPPA)</h2>
          <p>
            Our website and tools are not directed to children under 13 years of age. We do not knowingly collect personal information
            from children under 13.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">7. Contact Information</h2>
          <p>
            If you have questions, feedback, or concerns regarding this Privacy Policy, please contact us via our{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Page
            </Link>{" "}
            or email us at <strong className="text-foreground">support@replaner.in</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
