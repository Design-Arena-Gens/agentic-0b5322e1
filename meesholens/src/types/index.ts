export type JobStatus =
  | "queued"
  | "scraping"
  | "analyzing"
  | "summarizing"
  | "persisting"
  | "complete"
  | "error";

export interface ProductMetadata {
  id: string;
  url: string;
  title: string;
  category: string;
  image: string;
  ratingCount: number;
  averageRating: number;
  seller: {
    id: string;
    name: string;
    url?: string;
  };
  stockStatus: "in_stock" | "low_stock" | "sold_out" | "unknown";
  lastUpdated: string;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  currency: string;
  discountPercentage?: number;
}

export interface PricingSnapshot {
  currentPrice: number;
  previousPrice?: number;
  currency: string;
  discountPercentage?: number;
  trend: "up" | "down" | "steady";
  delta?: number;
  history: PricePoint[];
}

export interface ReviewRecord {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  images: string[];
  helpfulCount?: number;
  sentiment?: "positive" | "neutral" | "negative";
  topics?: string[];
  buyerProfile?: string;
}

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface TopicSignal {
  label: string;
  strength: number;
  keywords: string[];
}

export interface BuyerProfileInsight {
  label: string;
  share: number;
  description: string;
}

export interface SalesBehaviorInsight {
  momentum: "accelerating" | "steady" | "declining";
  estimatedMonthlyRevenue: number;
  confidence: number;
  notes: string[];
}

export interface AnalysisInsights {
  summary: string;
  sentiment: SentimentBreakdown;
  topTopics: TopicSignal[];
  buyerProfiles: BuyerProfileInsight[];
  salesBehavior: SalesBehaviorInsight;
  suggestedActions: string[];
}

export interface AnalysisResult {
  jobId: string;
  product: ProductMetadata;
  pricing: PricingSnapshot;
  reviews: ReviewRecord[];
  insights: AnalysisInsights;
  generatedAt: string;
}

export interface JobLog {
  message: string;
  code?: string;
  at: string;
}

export interface JobRecord {
  id: string;
  url: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  progress: number;
  logs: JobLog[];
  error?: string;
  result?: AnalysisResult;
}

export type RangeKey = "1m" | "6m" | "life";

export interface RangeFilter {
  label: string;
  value: RangeKey;
}
