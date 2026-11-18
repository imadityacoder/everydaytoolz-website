import { ComponentType } from "react";

export type ToolCategory =
  | "finance"
  | "media"
  | "developer"
  | "productivity"
  | "security";

export type CpcTier = "high" | "volume";

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface EditorialGuide {
  howToSteps: string[];
  formulaOrLogic: string;
  useCases: string[];
}

export interface ToolGuide {
  title: string;
  description: string;
  formula?: string;
  steps?: string[];
  notes?: string[];
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  iconName: string;
  keywords: string[];
  cpcTier: CpcTier;
  badge?: string;
  relatedToolSlugs?: string[];
  component?: ComponentType;

  // Expanded SEO & Editorial Properties
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  adSenseChannelId?: string;
  editorialGuide: EditorialGuide;
  faqs: ToolFAQ[];

  // Backward-compatibility guide support
  guide?: ToolGuide;
}

export interface ToolStats {
  toolId: string;
  usageCount: number;
  ratingCount: number;
  avgRating: number;
}
