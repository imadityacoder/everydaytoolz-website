import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, ArrowLeft, Send, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | EveryDayToolz",
  description:
    "Get in touch with the EveryDayToolz team for inquiries, bug reports, feature suggestions, or business partnerships.",
  alternates: {
    canonical: "https://replaner.in/contact",
  },
  openGraph: {
    title: "Contact Us | EveryDayToolz",
    description:
      "Get in touch with the EveryDayToolz team for inquiries, bug reports, feature suggestions, or business partnerships.",
    url: "https://replaner.in/contact",
  },
};

export default function ContactPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Feedback & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Contact Us
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Have a suggestion for a new tool? Found a calculation bug? Interested in partnering?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/60 pt-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-card/60 border border-border/70 space-y-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Direct Email</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reach our engineering and editorial team directly for questions, corrections, or support:
            </p>
            <p className="text-sm font-mono font-semibold text-primary pt-1">
              support@replaner.in
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card/60 border border-border/70 space-y-3">
            <div className="p-2.5 rounded-xl bg-brand-indigo/15 text-brand-indigo w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Feature Suggestions</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We continually expand our suite of client-side utilities. If there is a repetitive browser workflow
              or calculation you want automated with zero data upload, send us your proposal!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Response SLA</span>
            </div>
            <p>
              We typically review incoming inquiries and bug reports within 24 to 48 business hours.
            </p>
          </div>
        </div>

        {/* Quick Contact Box */}
        <div className="p-6 rounded-2xl bg-card/60 border border-border/70 space-y-5">
          <h2 className="text-lg font-bold text-foreground">Send Us a Message</h2>
          <form
            action="mailto:support@replaner.in"
            method="post"
            encType="text/plain"
            className="space-y-4 text-xs"
          >
            <div className="space-y-1.5">
              <label htmlFor="name" className="font-semibold text-foreground">
                Your Name / Organization
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="font-semibold text-foreground">
                Your Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="font-semibold text-foreground">
                Inquiry Topic
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="Bug Report">Bug Report / Math Correction</option>
                <option value="Feature Request">New Tool Suggestion</option>
                <option value="Partnership">Business or Advertising Inquiry</option>
                <option value="General">General Question</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="font-semibold text-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                placeholder="Describe your suggestion, issue, or question in detail..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
