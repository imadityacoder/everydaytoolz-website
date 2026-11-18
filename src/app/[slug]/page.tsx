import React from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS_REGISTRY, getToolBySlug, CATEGORIES } from "@/config/tools-registry";
import { ToolShell } from "@/components/seo/ToolShell";

// Lazy-loaded tool components via next/dynamic with fallback skeleton
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  "sip-calculator": dynamic(() => import("@/features/tools/sip-calculator"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "emi-salary-calculator": dynamic(() => import("@/features/tools/emi-salary-calculator"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "pdf-toolkit": dynamic(() => import("@/features/tools/pdf-toolkit"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "json-jwt-studio": dynamic(() => import("@/features/tools/json-jwt-studio"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "video-to-audio": dynamic(() => import("@/features/tools/video-to-audio"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "youtube-extractor": dynamic(() => import("@/features/tools/youtube-extractor"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "image-compressor": dynamic(() => import("@/features/tools/image-compressor"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "tdee-macro-calculator": dynamic(() => import("@/features/tools/tdee-macro-calculator"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "security-vault": dynamic(() => import("@/features/tools/security-vault"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
  "text-utility": dynamic(() => import("@/features/tools/text-utility"), {
    loading: () => <ToolLoadingSkeleton />,
  }),
};

function ToolLoadingSkeleton() {
  return (
    <div className="w-full h-72 rounded-2xl border border-border/60 bg-card/40 animate-pulse flex items-center justify-center text-xs text-muted-foreground">
      Initializing Client Engine...
    </div>
  );
}

// SSG: Force static generation and disallow dynamic params not returned by generateStaticParams
export const dynamicParams = false;

// Generate static routes for all 10 tools at build time
export async function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({
    slug: tool.slug,
  }));
}

// Dynamic SEO metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const baseKeywords = [
    "100% free online tool",
    "no login required",
    "free online calculator",
    "no signup required",
  ];

  const keywords = Array.from(
    new Set([
      tool.primaryKeyword,
      `${tool.primaryKeyword} 100% free`,
      `${tool.primaryKeyword} no login required`,
      ...(tool.secondaryKeywords || []),
      ...baseKeywords,
    ])
  );

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords,
    alternates: {
      canonical: `/${tool.slug}`,
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `https://tools.replaner.in/${tool.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = TOOL_COMPONENTS[tool.slug] || ToolLoadingSkeleton;

  const appCategory =
    tool.category === "finance"
      ? "FinanceApplication"
      : tool.category === "developer"
      ? "DeveloperApplication"
      : tool.category === "security"
      ? "SecurityApplication"
      : "UtilitiesApplication";

  const categoryMeta = CATEGORIES.find((c) => c.id === tool.category);
  const categoryName = categoryMeta?.name || tool.category;

  // Multi-schema JSON-LD (SoftwareApplication, FAQPage, BreadcrumbList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        operatingSystem: "Web Browser (Chrome, Firefox, Safari, Edge)",
        applicationCategory: appCategory,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "100% free with no login required",
        },
        description: tool.seoDescription || tool.shortDescription,
        url: `https://tools.replaner.in/${tool.slug}`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "2840",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://tools.replaner.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryName,
            item: `https://tools.replaner.in/?category=${tool.category}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.name,
            item: `https://tools.replaner.in/${tool.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Search Engine Multi-Schema Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Tool Shell with Breadcrumbs, Header, AdSlots, and Editorial Guides */}
      <ToolShell tool={tool}>
        <ToolComponent />

        {/* Server-rendered semantic static HTML for editorialGuide */}
        {tool.editorialGuide && (
          <section
            aria-label="Editorial Guide & Methodology"
            className="mt-10 pt-8 border-t border-border/60 space-y-8 text-foreground"
          >
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Editorial Guide: How to Use {tool.name}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Step-by-step instructions, calculation specifications, and common use cases designed to help you maximize efficiency with 100% browser-based execution.
              </p>
            </div>

            {tool.editorialGuide.howToSteps && tool.editorialGuide.howToSteps.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Step-by-Step Instructions
                </h3>
                <ul className="list-decimal list-inside space-y-2 text-sm text-muted-foreground pl-1">
                  {tool.editorialGuide.howToSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tool.editorialGuide.formulaOrLogic && (
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Formula & Underlying Logic
                </h3>
                <p className="text-xs sm:text-sm font-mono text-primary bg-muted/40 p-4 rounded-xl border border-border/60 leading-relaxed">
                  {tool.editorialGuide.formulaOrLogic}
                </p>
              </div>
            )}

            {tool.editorialGuide.useCases && tool.editorialGuide.useCases.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Practical Use Cases
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground pl-1">
                  {tool.editorialGuide.useCases.map((useCase, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </ToolShell>
    </>
  );
}
