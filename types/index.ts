import { Types } from "mongoose";

export interface Comment {
  id: number;          // Unique comment ID
  user: string;        // Name or username of commenter
  text: string;        // Comment content
  createdAt?: string;  // Optional timestamp
}

export interface Post {
  _id?: string;             // MongoDB ObjectId as string
  ownerId: string;         // User ID of the post owner
  title: string;           // Post title
  description: string;     // Post content
  tags: string[];          // List of tags
  status: "Draft" | "Published"; // Post status
  date: string;            // Creation date (ISO string)
  imageUrl?: string;       // Optional image URL
  comments: Comment[];     // List of comments
  likeCount?: number;      // Number of likes
  likedBy?: string[];      // Array of user IDs who liked this post
}

export interface NewsArticle {
  _id?: string; // <-- change from { type: ObjectId, required: false }
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source_id: string;
  image?: string;
  content?: string;
}


// Weather Interface
export interface Weather {
  location: string;
  tempRange: string;
  description: string;
  condition: string;
  highTemp: string;
  lowTemp: string;
  wind: string;
  humidity: string;
  chanceRain: string;
}

// Item Interface
export interface Item {
  name: string;
  qty?: number;
  checked?: boolean;
  eco?: boolean;
}

// Category Interface
export interface Category {
  name: string;
  items: Item[];
  _id: Types.ObjectId;
}

// Category Items Type
export type CategoryItems = {
  [key: string]: Item[];
};

// Trip Interface
export interface Trip {
  _id?: string;
  ownerUid: string;
  title: string;
  type: "Solo" | "Couple" | "Family" | "Group";
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  passengers: {
    adults: number;
    children: number;
    total: number;
  };
  budget: number;
  weather: Weather;
  packingLists?: Array<{ id: string; title: string; itemsCount: number }>;
}
// Packing List Interface
export interface PackingList {
  _id?: {type: Types.ObjectId, required:false};
  tripId?: string | Types.ObjectId;
  ownerUid: string;
  title: string;
  categories: {
    name: 'Clothing' | 'Toiletries' | 'Electronics' | 'Documents' | 'Miscellaneous';
    items: Item[];
  }[];
} 
export interface Product {
  _id?: {type: Types.ObjectId, required:false};
  name: string;
  category: string;
  eco: number; // 1-5
  description: string;
  availableLocation: string | string[];
  imageLink: string;
  createdAt?: string;
  updatedAt?: string;
}

// Store Types
export interface ChecklistStore {
  checklistCats: CategoryItems;
  removedItems: string[];
  newInputs: { [key: string]: string };
  activeCategory: string | null;
  setChecklistCats: (categories: CategoryItems) => void;
  setRemovedItems: (items: string[]) => void;
  setNewInputs: (inputs: { [key: string]: string }) => void;
  setActiveCategory: (category: string | null) => void;
  checkAllCategory: (category: string) => void;
  uncheckAllCategory: (category: string) => void;
  toggleItem: (category: string, itemName: string, checked: boolean) => void;
  addItem: (category: string, item: Item) => void;
  removeItem: (category: string, itemName: string) => void;
}

export interface TripStore {
  trips: Trip[];
  selectedTripId: string;
  loading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  setSelectedTripId: (id: string) => void;
}

export interface PackingListStore {
  lists: PackingList[];
  selectedListId: string;
  loading: boolean;
  error: string | null;
  fetchPackingLists: (tripId: string) => Promise<void>;
  setSelectedListId: (id: string) => void;
}

export interface SmartSuggestionsStore {
  smartCats: CategoryItems;
  smartRemoved: string[];
  setSmartCats: (cats: CategoryItems) => void;
  setSmartRemoved: (removed: string[]) => void;
  addSmartSuggestionToChecklist: (category: string, item: Item, checklistCats: CategoryItems) => CategoryItems;
  removeSmartSuggestion: (label: string) => void;
}

export interface UIStore {
  activeTab: 'weather' | 'checklist' | 'smart';
  setActiveTab: (tab: 'weather' | 'checklist' | 'smart') => void;
}

// Enhanced Report Types for Standardized System
export interface ReportType {
  id: string;
  name: string;
  value: string;
  label: string;
  description: string;
  category: 'analytics' | 'performance' | 'engagement' | 'sustainability';
  icon?: string;
  requiredFields: string[];
  supportedCharts: ChartType[];
  sampleDataAvailable: boolean;
}

export interface ReportOverview {
  totalReports: number;
  reportsThisMonth: number;
  popularTypes: string[];
  recentActivity: Array<{
    id: string;
    type: string;
    createdAt: string;
    status: string;
  }>;
  systemHealth: {
    averageGenerationTime: number;
    successRate: number;
    errorRate: number;
  };
  insights: {
    trending: string[];
    recommendations: string[];
  };
}

// Enhanced Chart Configuration
export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'donut' 
  | 'area' 
  | 'scatter' 
  | 'radar' 
  | 'heatmap' 
  | 'gauge' 
  | 'funnel'
  | 'stacked-bar'
  | 'multi-line'
  | 'combo';

export interface ChartConfiguration {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  data: ChartDataPoint[];
  options: ChartOptions;
  insights?: string[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface ChartOptions {
  responsive: boolean;
  colors: string[];
  theme: 'light' | 'dark';
  animations: boolean;
  legend: boolean;
  tooltip: boolean;
  grid?: boolean;
  axes?: {
    x?: AxisConfig;
    y?: AxisConfig;
  };
}

export interface AxisConfig {
  label: string;
  min?: number;
  max?: number;
  format?: string;
}

// Enhanced Summary Metrics
export interface SummaryMetrics {
  primary: MetricItem[];
  secondary: MetricItem[];
  trends: TrendItem[];
  comparisons: ComparisonItem[];
}

export interface MetricItem {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
  color?: string;
  icon?: string;
}

export interface TrendItem {
  period: string;
  value: number;
  change: number;
}

export interface ComparisonItem {
  label: string;
  current: number;
  previous: number;
  benchmark?: number;
}

// Enhanced Report Interface
export interface Report {
  _id?: string;
  id?: string;
  ownerUid: string;
  title: string;
  type: string;
  category: string;
  generatedAt: string;
  format: string;
  isScheduled: boolean;
  scheduleFrequency?: string;
  lastGenerated?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tags: string[];
  filters?: ReportFilters;
  data?: EnhancedReportData;
  metadata: ReportMetadata;
  createdAt: string;
  updatedAt: string;
  formattedGeneratedAt?: string;
  statusDisplay?: string;
  reportAge?: string;
  __v?: number;
  errorMessage?: string;
  description?: string;
  version?: string;
  aiGenerated?: boolean;
}

// Enhanced Report Data Structure
export interface EnhancedReportData {
  summary: SummaryMetrics;
  charts: ChartConfiguration[];
  details: DetailedAnalysis;
  recommendations: AIRecommendations;
  insights: KeyInsights;
  rawData?: Record<string, unknown>;
  exportFormats?: string[];
}

export interface ReportMetadata {
  version: string;
  generatedBy: string;
  generationTime: number;
  dataPoints: number;
  confidence: number;
  sources: string[];
  lastUpdated: string;
}

export interface DetailedAnalysis {
  sections: AnalysisSection[];
  correlations: CorrelationItem[];
  patterns: PatternItem[];
  anomalies: AnomalyItem[];
}

export interface AnalysisSection {
  title: string;
  content: string;
  data: Record<string, unknown>;
  visualizations?: string[];
}

export interface CorrelationItem {
  variables: string[];
  strength: number;
  significance: number;
  interpretation: string;
}

export interface PatternItem {
  type: 'seasonal' | 'trending' | 'cyclical' | 'anomalous';
  description: string;
  confidence: number;
  timeframe: string;
}

export interface AnomalyItem {
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  explanation: string;
}

export interface AIRecommendations {
  immediate: RecommendationItem[];
  shortTerm: RecommendationItem[];
  longTerm: RecommendationItem[];
  priority: 'high' | 'medium' | 'low';
}

export interface RecommendationItem {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
  metrics?: string[];
}

export interface KeyInsights {
  topFindings: InsightItem[];
  trends: InsightItem[];
  opportunities: InsightItem[];
  risks: InsightItem[];
}

export interface InsightItem {
  title: string;
  description: string;
  confidence: number;
  impact: number;
  supporting_data: string[];
}

// Enhanced Filters
export interface ReportFilters {
  dateRange?: {
    startDate: string;
    endDate: string;
    preset?: 'last7days' | 'last30days' | 'last90days' | 'lastyear' | 'custom';
  };
  includeArchived?: boolean;
  minRecords?: number;
  categories?: string[];
  userSegments?: string[];
  geographicRegions?: string[];
  sustainabilityLevels?: string[];
  budgetRanges?: string[];
  // Backend customization options (extracted by service layer)
  includeOptionalFields?: boolean;
  specificFields?: string[] | null;
  lightweight?: boolean;
  [key: string]: unknown;
}

// Enhanced Report Generation Request
export interface ReportGenerateRequest {
  type: string;
  title: string;
  description?: string;
  category?: string;
  parameters?: Record<string, unknown>;
  filters?: ReportFilters;
  options?: {
    includeAI?: boolean;
    generateInsights?: boolean;
    includeRecommendations?: boolean;
    chartTypes?: ChartType[];
    exportFormats?: string[];
    priority?: 'high' | 'normal' | 'low';
  };
  scheduling?: {
    isScheduled?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    nextRun?: string;
  };
}

// Enhanced Report Store Interface
export interface ReportStore {
  reports: Report[];
  reportTypes: ReportType[];
  overview: ReportOverview | null;
  selectedReport: Report | null;
  loading: boolean;
  error: string | null;
  
  // Enhanced report types and formats
  getTypes: () => Promise<void>;
  getFormats: () => Promise<ReportType[]>;
  getSampleData: (type: string) => Promise<EnhancedReportData>;
  
  // Overview and analytics
  getOverview: () => Promise<void>;
  getAnalytics: () => Promise<ReportOverview>;
  
  // Enhanced report management
  fetchReports: (filters?: ReportFilters) => Promise<void>;
  generateReport: (request: ReportGenerateRequest) => Promise<Report>;
  getReport: (id: string) => Promise<void>;
  regenerateReport: (id: string) => Promise<void>;
  scheduleReport: (id: string, schedule: ReportGenerateRequest['scheduling']) => Promise<void>;
  
  // Enhanced export capabilities
  exportReport: (id: string, format: 'json' | 'pdf' | 'csv' | 'xlsx') => Promise<void>;
  bulkExport: (reportIds: string[], format: string) => Promise<void>;
  
  // Report lifecycle
  deleteReport: (id: string) => Promise<void>;
  archiveReport: (id: string) => Promise<void>;
  duplicateReport: (id: string, newTitle?: string) => Promise<string>;
  
  // Real-time features
  subscribeToReport: (id: string) => Promise<void>;
  unsubscribeFromReport: (id: string) => Promise<void>;
  
  // Enhanced UI state
  setSelectedReport: (report: Report | null) => void;
  setFilters: (filters: ReportFilters) => void;
  clearError: () => void;
  
  // Testing and development
  injectMockData: () => void;
  generateSampleReport: (type: string) => Promise<Report>;
  validateReportData: (data: EnhancedReportData) => boolean;
}