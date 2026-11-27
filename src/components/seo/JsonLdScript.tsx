import React from "react";
import { ToolDefinition } from "@/types/tools";

interface JsonLdScriptProps {
  tool: ToolDefinition;
  siteUrl?: string;
}

export function JsonLdScript({ tool, siteUrl = "https://replaner.in/tools" }: JsonLdScriptProps) {
  const toolUrl = `${siteUrl}/${tool.slug}`;

  // SoftwareApplication Schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    operatingSystem: "Web Browser (Chrome, Firefox, Safari, Edge)",
    applicationCategory:
      tool.category === "finance"
        ? "FinanceApplication"
        : tool.category === "developer"
        ? "DeveloperApplication"
        : tool.category === "security"
        ? "SecurityApplication"
        : "UtilitiesApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.shortDescription,
    url: toolUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2840",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // FAQPage Schema
  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
    </>
  );
}
