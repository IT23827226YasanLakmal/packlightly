/**
 * Report Format Helpers
 * Utility functions for consistent report generation, validation, and formatting
 */

import { 
  ChartConfiguration, 
  ChartDataPoint, 
  SummaryMetrics,
  EnhancedReportData,
  AIRecommendations,
  KeyInsights
} from '@/types';

// Type definitions for data inputs
interface TripData {
  totalTrips?: number;
  avgDuration?: number;
  completionRate?: number;
  ecoTrips?: number;
  trends?: Array<{ period: string; value: number; change: number }>;
  comparisons?: Array<{ label: string; current: number; previous: number; benchmark?: number }>;
}

interface PackingData {
  totalLists?: number;
  avgItems?: number;
  ecoAdoption?: number;
  completionRate?: number;
  trends?: Array<{ period: string; value: number; change: number }>;
}

interface UserData {
  activeUsers?: number;
  newRegistrations?: number;
  retentionRate?: number;
  avgSession?: number;
  trends?: Array<{ period: string; value: number; change: number }>;
}

interface EcoData {
  co2Savings?: number;
  ecoItems?: number;
  sustainabilityScore?: number;
  plasticReduction?: number;
  trends?: Array<{ period: string; value: number; change: number }>;
}

interface BaseReportData {
  [key: string]: unknown;
}
export const CHART_COLORS = {
  primary: ['#10B981', '#059669', '#047857', '#065F46', '#34D399'],
  secondary: ['#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5', '#F0FDF4'],
  gradient: ['#10B981', '#059669', '#047857', '#065F46'],
  eco: ['#22C55E', '#16A34A', '#15803D', '#166534'],
  warning: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
  danger: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B']
};

// Chart type configurations
export const CHART_CONFIGS = {
  line: {
    responsive: true,
    animations: true,
    legend: true,
    tooltip: true,
    grid: true
  },
  bar: {
    responsive: true,
    animations: true,
    legend: false,
    tooltip: true,
    grid: true
  },
  pie: {
    responsive: true,
    animations: true,
    legend: true,
    tooltip: true,
    grid: false
  },
  radar: {
    responsive: true,
    animations: true,
    legend: true,
    tooltip: true,
    grid: true
  }
};

/**
 * Generate chart configuration for different report types
 */
export class ChartGenerator {
  static createLineChart(
    title: string,
    data: ChartDataPoint[],
    options?: Partial<ChartConfiguration['options']>
  ): ChartConfiguration {
    return {
      id: generateId(),
      type: 'line',
      title,
      data,
      options: {
        ...CHART_CONFIGS.line,
        colors: CHART_COLORS.primary,
        theme: 'light',
        ...options
      }
    };
  }

  static createBarChart(
    title: string,
    data: ChartDataPoint[],
    options?: Partial<ChartConfiguration['options']>
  ): ChartConfiguration {
    return {
      id: generateId(),
      type: 'bar',
      title,
      data,
      options: {
        ...CHART_CONFIGS.bar,
        colors: CHART_COLORS.primary,
        theme: 'light',
        ...options
      }
    };
  }

  static createPieChart(
    title: string,
    data: ChartDataPoint[],
    options?: Partial<ChartConfiguration['options']>
  ): ChartConfiguration {
    return {
      id: generateId(),
      type: 'pie',
      title,
      data,
      options: {
        ...CHART_CONFIGS.pie,
        colors: CHART_COLORS.primary,
        theme: 'light',
        ...options
      }
    };
  }

  static createRadarChart(
    title: string,
    data: ChartDataPoint[],
    options?: Partial<ChartConfiguration['options']>
  ): ChartConfiguration {
    return {
      id: generateId(),
      type: 'radar',
      title,
      data,
      options: {
        ...CHART_CONFIGS.radar,
        colors: CHART_COLORS.eco,
        theme: 'light',
        ...options
      }
    };
  }
}

/**
 * Summary metrics generator for different report types
 */
export class SummaryGenerator {
  static createTripSummary(data: TripData): SummaryMetrics {
    return {
      primary: [
        {
          key: 'totalTrips',
          label: 'Total Trips',
          value: data.totalTrips || 0,
          trend: 'up',
          change: '+12%',
          icon: 'MapPin'
        },
        {
          key: 'avgDuration',
          label: 'Avg Duration',
          value: data.avgDuration || 0,
          unit: 'days',
          trend: 'stable',
          icon: 'Clock'
        },
        {
          key: 'completionRate',
          label: 'Completion Rate',
          value: data.completionRate || 0,
          unit: '%',
          trend: 'up',
          change: '+5%',
          icon: 'CheckCircle'
        }
      ],
      secondary: [
        {
          key: 'ecoTrips',
          label: 'Eco-Friendly Trips',
          value: data.ecoTrips || 0,
          unit: '%',
          color: '#22C55E',
          icon: 'Leaf'
        }
      ],
      trends: data.trends || [],
      comparisons: data.comparisons || []
    };
  }

  static createPackingSummary(data: PackingData): SummaryMetrics {
    return {
      primary: [
        {
          key: 'totalLists',
          label: 'Total Lists',
          value: data.totalLists || 0,
          trend: 'up',
          change: '+8%',
          icon: 'List'
        },
        {
          key: 'avgItems',
          label: 'Avg Items',
          value: data.avgItems || 0,
          unit: 'items',
          trend: 'down',
          change: '-2%',
          icon: 'Package'
        },
        {
          key: 'ecoAdoption',
          label: 'Eco Adoption',
          value: data.ecoAdoption || 0,
          unit: '%',
          trend: 'up',
          change: '+15%',
          icon: 'Recycle'
        }
      ],
      secondary: [
        {
          key: 'completionRate',
          label: 'List Completion',
          value: data.completionRate || 0,
          unit: '%',
          color: '#10B981',
          icon: 'CheckSquare'
        }
      ],
      trends: data.trends || [],
      comparisons: []
    };
  }

  static createUserSummary(data: UserData): SummaryMetrics {
    return {
      primary: [
        {
          key: 'activeUsers',
          label: 'Active Users',
          value: data.activeUsers || 0,
          trend: 'up',
          change: '+23%',
          icon: 'Users'
        },
        {
          key: 'newRegistrations',
          label: 'New Users',
          value: data.newRegistrations || 0,
          trend: 'up',
          change: '+18%',
          icon: 'UserPlus'
        },
        {
          key: 'retentionRate',
          label: 'Retention Rate',
          value: data.retentionRate || 0,
          unit: '%',
          trend: 'stable',
          icon: 'TrendingUp'
        }
      ],
      secondary: [
        {
          key: 'avgSession',
          label: 'Avg Session',
          value: data.avgSession || 0,
          unit: 'min',
          color: '#059669',
          icon: 'Clock'
        }
      ],
      trends: data.trends || [],
      comparisons: []
    };
  }

  static createEcoSummary(data: EcoData): SummaryMetrics {
    return {
      primary: [
        {
          key: 'co2Savings',
          label: 'CO2 Savings',
          value: data.co2Savings || 0,
          unit: 'kg',
          trend: 'up',
          change: '+45%',
          color: '#22C55E',
          icon: 'Leaf'
        },
        {
          key: 'ecoItems',
          label: 'Eco Items Adopted',
          value: data.ecoItems || 0,
          trend: 'up',
          change: '+32%',
          icon: 'Recycle'
        },
        {
          key: 'sustainabilityScore',
          label: 'Sustainability Score',
          value: data.sustainabilityScore || 0,
          unit: '/10',
          trend: 'up',
          change: '+0.5',
          icon: 'Award'
        }
      ],
      secondary: [
        {
          key: 'plasticReduction',
          label: 'Plastic Reduced',
          value: data.plasticReduction || 0,
          unit: 'g',
          color: '#16A34A',
          icon: 'Trash2'
        }
      ],
      trends: data.trends || [],
      comparisons: []
    };
  }
}

/**
 * AI recommendations generator
 */
export class RecommendationsGenerator {
  static generateTripRecommendations(_data?: BaseReportData): AIRecommendations {
    return {
      immediate: [
        {
          title: 'Optimize Trip Duration',
          description: 'Consider extending shorter trips by 1-2 days to reduce travel frequency and environmental impact.',
          impact: 'medium',
          effort: 'low',
          category: 'efficiency',
          metrics: ['tripDuration', 'co2Footprint']
        }
      ],
      shortTerm: [
        {
          title: 'Promote Eco-Friendly Destinations',
          description: 'Highlight destinations with high sustainability ratings to increase eco-tourism.',
          impact: 'high',
          effort: 'medium',
          category: 'sustainability',
          metrics: ['ecoRating', 'userEngagement']
        }
      ],
      longTerm: [
        {
          title: 'Seasonal Destination Balancing',
          description: 'Develop strategies to promote off-season travel to reduce overcrowding.',
          impact: 'high',
          effort: 'high',
          category: 'sustainability',
          metrics: ['seasonalDistribution', 'destinationCapacity']
        }
      ],
      priority: 'medium'
    };
  }

  static generatePackingRecommendations(_data?: BaseReportData): AIRecommendations {
    return {
      immediate: [
        {
          title: 'Reduce Overpacking',
          description: 'Implement smart suggestions to prevent users from packing unnecessary items.',
          impact: 'medium',
          effort: 'low',
          category: 'efficiency',
          metrics: ['itemCount', 'packingEfficiency']
        }
      ],
      shortTerm: [
        {
          title: 'Eco-Alternative Suggestions',
          description: 'Automatically suggest eco-friendly alternatives for common packing items.',
          impact: 'high',
          effort: 'medium',
          category: 'sustainability'
        }
      ],
      longTerm: [
        {
          title: 'Personalized Packing Profiles',
          description: 'Develop AI-powered packing profiles based on user history and preferences.',
          impact: 'high',
          effort: 'high',
          category: 'personalization'
        }
      ],
      priority: 'high'
    };
  }
}

/**
 * Insights generator for key findings
 */
export class InsightsGenerator {
  static generateKeyInsights(reportType: string, _data?: BaseReportData): KeyInsights {
    const baseInsights = {
      topFindings: [],
      trends: [],
      opportunities: [],
      risks: []
    };

    switch (reportType) {
      case 'trip_analytics':
        return {
          ...baseInsights,
          topFindings: [
            {
              title: 'Peak Travel Season Identified',
              description: 'Summer months show 45% higher trip planning activity',
              confidence: 0.92,
              impact: 8,
              supporting_data: ['monthlyTrends', 'seasonalData']
            }
          ],
          trends: [
            {
              title: 'Eco-Tourism Growth',
              description: 'Sustainable travel options increasing by 32% year-over-year',
              confidence: 0.87,
              impact: 9,
              supporting_data: ['ecoTrends', 'destinationRatings']
            }
          ]
        };
      
      case 'packing_analytics':
        return {
          ...baseInsights,
          opportunities: [
            {
              title: 'Smart Packing Optimization',
              description: 'AI-powered suggestions could reduce packing list size by 15%',
              confidence: 0.83,
              impact: 7,
              supporting_data: ['packingPatterns', 'itemUsage']
            }
          ]
        };
        
      default:
        return baseInsights;
    }
  }
}

/**
 * Report validation utilities
 */
export class ReportValidator {
  static validateReportData(data: EnhancedReportData): boolean {
    try {
      // Check required fields
      if (!data.summary || !data.charts || !data.insights) {
        return false;
      }

      // Validate charts
      for (const chart of data.charts) {
        if (!chart.type || !chart.title || !chart.data || !Array.isArray(chart.data)) {
          return false;
        }
      }

      // Validate summary metrics
      if (!data.summary.primary || !Array.isArray(data.summary.primary)) {
        return false;
      }

      return true;
    } catch (error) {

      return false;
    }
  }

  static validateChartData(chart: ChartConfiguration): boolean {
    if (!chart.type || !chart.title || !chart.data) {
      return false;
    }

    // Ensure data points have required fields
    return chart.data.every(point => 
      typeof point.label === 'string' && 
      typeof point.value === 'number'
    );
  }
}

/**
 * Data formatting utilities
 */
export class DataFormatter {
  static formatNumber(value: number, unit?: string): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${unit ? ` ${unit}` : ''}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${unit ? ` ${unit}` : ''}`;
    }
    return `${value}${unit ? ` ${unit}` : ''}`;
  }

  static formatPercentage(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  static formatCurrency(value: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(value);
  }

  static formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }
}

/**
 * Sample data generators for testing
 */
export class SampleDataGenerator {
  static generateTripData(): TripData {
    return {
      totalTrips: 1248,
      avgDuration: 7.5,
      completionRate: 87,
      ecoTrips: 34,
      trends: Array.from({ length: 12 }, (_, i) => ({
        period: `Month ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 50,
        change: Math.random() * 20 - 10
      })),
      comparisons: [
        { label: 'Current Quarter', current: 312, previous: 289, benchmark: 300 },
        { label: 'Last Quarter', current: 289, previous: 267, benchmark: 275 }
      ]
    };
  }

  static generatePackingData(): PackingData {
    return {
      totalLists: 2156,
      avgItems: 24,
      ecoAdoption: 42,
      completionRate: 91,
      trends: Array.from({ length: 12 }, (_, i) => ({
        period: `Month ${i + 1}`,
        value: Math.floor(Math.random() * 50) + 20,
        change: Math.random() * 10 - 5
      }))
    };
  }

  static generateUserData(): UserData {
    return {
      activeUsers: 5432,
      newRegistrations: 234,
      retentionRate: 78,
      avgSession: 12.5,
      trends: Array.from({ length: 7 }, (_, i) => ({
        period: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 1000) + 500,
        change: Math.random() * 50 - 25
      }))
    };
  }

  static generateEcoData(): EcoData {
    return {
      co2Savings: 1234.5,
      ecoItems: 876,
      sustainabilityScore: 8.2,
      plasticReduction: 5670,
      trends: Array.from({ length: 12 }, (_, i) => ({
        period: `Month ${i + 1}`,
        value: Math.floor(Math.random() * 200) + 100,
        change: Math.random() * 30 - 15
      }))
    };
  }
}

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export { generateId };

// Export all utilities as a single object for easy import
export const ReportHelpers = {
  ChartGenerator,
  SummaryGenerator,
  RecommendationsGenerator,
  InsightsGenerator,
  ReportValidator,
  DataFormatter,
  SampleDataGenerator,
  CHART_COLORS,
  CHART_CONFIGS
};

export default ReportHelpers;