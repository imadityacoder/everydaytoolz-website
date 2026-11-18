import { ImageResponse } from "next/og";
import { getToolBySlug, TOOLS_REGISTRY, CATEGORIES } from "@/config/tools-registry";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  const name = tool?.name || "EveryDayToolz Utility";
  const categoryMeta = CATEGORIES.find((c) => c.id === tool?.category);
  const categoryName = categoryMeta?.name || (tool?.category || "Utility").toUpperCase();
  const description =
    tool?.seoDescription ||
    tool?.shortDescription ||
    "Free, fast, client-side utility with zero data collection and zero login wall.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#070B14",
          padding: "60px 70px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top Header: Brand and Category Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Logo / Brand Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#7C4DFF",
                color: "#FFFFFF",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              E
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "26px",
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: "-0.5px",
              }}
            >
              EveryDay<span style={{ color: "#7C4DFF" }}>Toolz</span>
            </div>
          </div>

          {/* Category Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 22px",
              borderRadius: "9999px",
              backgroundColor: "rgba(124, 77, 255, 0.15)",
              border: "1px solid #7C4DFF",
              color: "#4FD1FF",
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            {categoryName}
          </div>
        </div>

        {/* Center: Tool Name and SEO Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: "800",
              color: "#FFFFFF",
              letterSpacing: "-1.5px",
              lineHeight: 1.15,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              lineHeight: 1.5,
              maxWidth: "1000px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom Bar: Feature Highlights and Root Canonical URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "1px solid rgba(124, 77, 255, 0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#4FD1FF",
              backgroundColor: "rgba(79, 209, 255, 0.1)",
              padding: "10px 20px",
              borderRadius: "10px",
              border: "1px solid rgba(79, 209, 255, 0.3)",
            }}
          >
            100% Free • No Login Required • In-Browser
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#7C4DFF",
              fontFamily: "monospace",
            }}
          >
            {`tools.replaner.in/${slug}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
