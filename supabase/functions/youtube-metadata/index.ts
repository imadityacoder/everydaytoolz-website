// Supabase Edge Function: youtube-metadata
// Safely scrapes YouTube oEmbed and metadata without browser CORS errors

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface YouTubeMetaResponse {
  videoId: string;
  title: string;
  authorName: string;
  authorUrl: string;
  thumbnailUrl: string;
  availableThumbnails: {
    maxres: string;
    hq: string;
    mq: string;
    sd: string;
    default: string;
  };
  embedHtml: string;
  keywords?: string[];
  description?: string;
}

function extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameter: url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const videoId = extractYouTubeId(targetUrl);
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: "Invalid YouTube URL. Could not extract Video ID." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch YouTube oEmbed
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedRes = await fetch(oembedUrl);
    
    let title = "YouTube Video";
    let authorName = "YouTube Creator";
    let authorUrl = `https://www.youtube.com/channel/`;
    let embedHtml = "";

    if (oembedRes.ok) {
      const oembedData = await oembedRes.json();
      title = oembedData.title || title;
      authorName = oembedData.author_name || authorName;
      authorUrl = oembedData.author_url || authorUrl;
      embedHtml = oembedData.html || embedHtml;
    }

    // 2. Fetch page HTML to extract tags / keywords / description if possible
    let keywords: string[] = [];
    let description = "";

    try {
      const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();
        
        // Extract meta description
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        if (descMatch && descMatch[1]) {
          description = descMatch[1];
        }

        // Extract meta keywords
        const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i);
        if (keywordsMatch && keywordsMatch[1]) {
          keywords = keywordsMatch[1].split(",").map((k) => k.trim()).filter(Boolean);
        }
      }
    } catch {
      // Non-blocking fallback
    }

    const responsePayload: YouTubeMetaResponse = {
      videoId,
      title,
      authorName,
      authorUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      availableThumbnails: {
        maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      },
      embedHtml,
      keywords,
      description,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
