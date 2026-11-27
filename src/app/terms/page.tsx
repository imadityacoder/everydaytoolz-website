import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | EveryDayToolz",
  description:
    "EveryDayToolz Terms of Service: rules, disclaimers, and guidelines for using our 100% free online browser tools.",
  alternates: {
    canonical: "https://replaner.in/terms",
  },
  openGraph: {
    title: "Terms of Service | EveryDayToolz",
    description:
      "EveryDayToolz Terms of Service: rules, disclaimers, and guidelines for using our 100% free online browser tools.",
    url: "https://replaner.in/terms",
  },
};

export default function TermsPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement & Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground">
          Last updated: November 2026 • Effective immediately
        </p>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-8">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Agreement to Terms</h2>
          <p>
            By accessing or using EveryDayToolz (<strong className="text-foreground">replaner.in/tools</strong>), you agree
            to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms,
            you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Permitted Use & Free Access</h2>
          <p>
            EveryDayToolz provides 100% free access to all online calculators, file manipulators, formatters, and utilities
            without requiring account registration, logins, credit cards, or subscription fees.
          </p>
          <div className="p-4 rounded-2xl bg-card/60 border border-border/70 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>You Are Permitted To:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground pl-1">
              <li>Use the tools for personal, educational, commercial, and professional workflows.</li>
              <li>Process, merge, convert, compress, and inspect your own files and data locally in your browser.</li>
              <li>Export and share generated schedules, calculations, and converted media outputs freely.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Financial, Medical, and Calculation Disclaimer</h2>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Important Disclaimer:</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Calculators (including SIP, Loan EMI, Salary Deductions, TDEE, and Macros) provide mathematical estimates
              based on user inputs and standard formulas. They do not constitute certified financial, tax, legal, or medical advice.
              Always consult qualified financial advisors, tax professionals, or healthcare providers before making significant decisions.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Intellectual Property</h2>
          <p>
            The website design, branding, custom user interface components, and curated documentation on EveryDayToolz
            are the exclusive property of EveryDayToolz and its operators.
          </p>
          <p>
            All content and data processed by you using the tools remain entirely your property. We do not claim any ownership,
            license, or rights over your files, text, images, or outputs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Engage in automated denial-of-service or malicious traffic flooding of the hosting endpoints.</li>
            <li>Attempt to bypass security headers, bot filters, or platform safeguards.</li>
            <li>Use the tools to process unlawful, defamatory, or infringing content.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">6. Limitation of Liability</h2>
          <p>
            The materials and tools on EveryDayToolz are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
            In no event shall EveryDayToolz, its developers, or its hosts be liable for any direct, indirect, incidental,
            or consequential damages arising out of the use or inability to use the tools or materials on this website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">7. Modifications to Terms</h2>
          <p>
            We may revise these Terms of Service at any time without notice. By using this website, you agree to be bound
            by the current version of these Terms of Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">8. Questions & Contact</h2>
          <p>
            If you have any questions regarding these Terms, please reach out via our{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Page
            </Link>{" "}
            or via email at <strong className="text-foreground">support@replaner.in</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
