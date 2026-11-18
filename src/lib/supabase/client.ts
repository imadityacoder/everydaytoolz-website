import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function createClient() {
  if (!isSupabaseConfigured) {
    return null;
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

/**
 * Increment tool usage counter atomically via stored procedure.
 * Falls back silently if Supabase is unconfigured or offline.
 */
export async function trackToolUsage(toolId: string): Promise<{ usageCount: number; avgRating: number } | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.rpc("increment_tool_usage", {
      tool_id_input: toolId,
    });
    if (error) {
      console.warn("Could not increment tool usage:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("trackToolUsage network error:", err);
    return null;
  }
}

/**
 * Fetch current stats for a tool.
 */
export async function getToolStats(toolId: string): Promise<{ usageCount: number; avgRating: number; ratingCount: number } | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("tool_stats")
      .select("usage_count, total_rating_sum, rating_count")
      .eq("tool_id", toolId)
      .single();

    if (error || !data) return null;

    const avg = data.rating_count > 0 ? Number((data.total_rating_sum / data.rating_count).toFixed(1)) : 5.0;
    return {
      usageCount: data.usage_count,
      avgRating: avg,
      ratingCount: data.rating_count,
    };
  } catch {
    return null;
  }
}
