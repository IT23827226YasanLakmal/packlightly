import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig } from '@/utils/fetcher';
import { 
  Report, 
  ReportGenerateRequest, 
  ReportStore,
  ReportType,
  ReportOverview,
  EnhancedReportData,
  ReportFilters
} from '@/types';
import { ReportHelpers } from '@/utils/reportFormatHelpers';

export const useReportStore = create<ReportStore>((set, get) => ({
  reports: [],
  reportTypes: [],
  overview: null,
  selectedReport: null,
  loading: false,
  error: null,

  getTypes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/types`);
      
      // Handle different response structures
      let typesData = response;
      if (response.success && response.data) {
        typesData = response.data;
      }
      
      set({ reportTypes: Array.isArray(typesData) ? typesData : [], loading: false });
    } catch {
      set({ error: 'Failed to fetch report types', loading: false });
    }
  },

  getFormats: async (): Promise<ReportType[]> => {
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/formats`);
      return response.data || response;
    } catch {
      return [];
    }
  },

  getSampleData: async (type: string): Promise<EnhancedReportData> => {
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/sample/${type}`);
      return response.data || response;
    } catch {
      // Return generated sample data as fallback
      const sampleData = ReportHelpers.SampleDataGenerator.generateTripData();
      return {
        summary: ReportHelpers.SummaryGenerator.createTripSummary(sampleData),
        charts: [
          ReportHelpers.ChartGenerator.createLineChart('Sample Trend', [
            { label: 'Jan', value: 100 },
            { label: 'Feb', value: 120 },
            { label: 'Mar', value: 90 }
          ])
        ],
        details: { sections: [], correlations: [], patterns: [], anomalies: [] },
        recommendations: ReportHelpers.RecommendationsGenerator.generateTripRecommendations(),
        insights: ReportHelpers.InsightsGenerator.generateKeyInsights(type)
      };
    }
  },

  getOverview: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/overview`);
      
      // Handle different response structures
      let overviewData = response;
      if (response.success && response.data) {
        overviewData = response.data;
      }
      
      set({ overview: overviewData, loading: false });
    } catch {
      set({ error: 'Failed to fetch overview', loading: false });
    }
  },

  getAnalytics: async (): Promise<ReportOverview> => {
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/analytics`);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  fetchReports: async (filters?: ReportFilters) => {

    set({ loading: true, error: null });
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/reports`;
      
      // Filter out non-plain objects and DOM elements to prevent circular references
      if (filters && typeof filters === 'object' && filters.constructor === Object) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            try {
              if (typeof value === 'object') {
                // Only stringify plain objects, skip DOM elements and other complex objects
                if (value.constructor === Object || Array.isArray(value)) {
                  params.append(key, JSON.stringify(value));
                } else {
                  // For other objects, try to convert to string safely
                  params.append(key, String(value));
                }
              } else {
                params.append(key, String(value));
              }
            } catch (error) {

              // Skip this filter if it can't be serialized
            }
          }
        });
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetcherWithToken(url);

      
      // Handle different response structures
      let reportsData = response;
      if (response.success && response.data) {
        reportsData = response.data;
      }
      
      set({ reports: Array.isArray(reportsData) ? reportsData : [], loading: false });
    } catch (error) {

      set({ error: 'Failed to fetch reports', loading: false });
    }
  },

  generateReport: async (request: ReportGenerateRequest): Promise<Report> => {

    set({ loading: true, error: null });
    try {
      const data = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/generate`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      set({ loading: false });
      // Refresh reports list to include the new report
      await get().fetchReports();
      return data;
    } catch (error) {

      set({ error: 'Failed to generate enhanced report', loading: false });
      throw error;
    }
  },

  getReport: async (id: string) => {

    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`);

      
      let reportData = data;
      if (data.success && data.data) {
        reportData = data.data;
      }
      
      set({ selectedReport: reportData, loading: false });
    } catch (error) {

      set({ error: 'Failed to fetch report details', loading: false });
    }
  },

  regenerateReport: async (id: string) => {

    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/regenerate`, {
        method: 'POST',
      });
      set({ loading: false });
      await get().fetchReports();
    } catch (error) {

      set({ error: 'Failed to regenerate report', loading: false });
    }
  },

  scheduleReport: async (id: string, schedule: ReportGenerateRequest['scheduling']) => {

    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/schedule`, {
        method: 'POST',
        body: JSON.stringify(schedule),
      });
      await get().fetchReports();
    } catch (error) {

      throw error;
    }
  },

  exportReport: async (id: string, format: 'json' | 'pdf' | 'csv' | 'xlsx') => {

    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/export/${id}/${format}`);
      
      // Handle file download - response should be a Blob for file downloads
      if (response instanceof Blob) {

        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${id}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

      } else {

        // Handle JSON response if needed
      }
    } catch (error) {

      throw error;
    }
  },

  bulkExport: async (reportIds: string[], format: string) => {

    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/bulk-export`, {
        method: 'POST',
        body: JSON.stringify({ reportIds, format }),
      });
    } catch (error) {

      throw error;
    }
  },

  deleteReport: async (id: string) => {

    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
        method: 'DELETE',
      });
      set({ loading: false });
      await get().fetchReports();
    } catch (error) {

      set({ error: 'Failed to delete report', loading: false });
    }
  },

  archiveReport: async (id: string) => {

    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/archive`, {
        method: 'POST',
      });
      await get().fetchReports();
    } catch (error) {

      throw error;
    }
  },

  duplicateReport: async (id: string, newTitle?: string): Promise<string> => {

    try {
      const response = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/duplicate`, {
        method: 'POST',
        body: JSON.stringify({ newTitle }),
      });
      await get().fetchReports();
      return response.id || response._id;
    } catch (error) {

      throw error;
    }
  },

  subscribeToReport: async (id: string) => {

    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/subscribe`, {
        method: 'POST',
      });
    } catch (error) {

      throw error;
    }
  },

  unsubscribeFromReport: async (id: string) => {

    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/unsubscribe`, {
        method: 'POST',
      });
    } catch (error) {

      throw error;
    }
  },

  setSelectedReport: (report: Report | null) => {
    set({ selectedReport: report });
  },

  setFilters: (filters: ReportFilters) => {

    // Apply filters and refresh reports
    get().fetchReports(filters);
  },

  clearError: () => {
    set({ error: null });
  },

  generateSampleReport: async (type: string): Promise<Report> => {

    try {
      const sampleData = await get().getSampleData(type);
      const sampleReport: Report = {
        _id: `sample-${Date.now()}`,
        ownerUid: 'sample-user',
        title: `Sample ${type} Report`,
        type,
        category: 'analytics',
        generatedAt: new Date().toISOString(),
        format: 'json',
        isScheduled: false,
        status: 'completed',
        tags: ['sample', 'test'],
        data: sampleData,
        metadata: {
          version: '1.0',
          generatedBy: 'sample-generator',
          generationTime: 1000,
          dataPoints: 100,
          confidence: 0.85,
          sources: ['sample'],
          lastUpdated: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return sampleReport;
    } catch (error) {

      throw error;
    }
  },

  validateReportData: (data: EnhancedReportData): boolean => {
    return ReportHelpers.ReportValidator.validateReportData(data);
  },

  // Enhanced mock data for testing
  injectMockData: () => {

    set({
      reportTypes: [
        { 
          id: 'trip_analytics', 
          name: 'Trip Analytics', 
          value: 'trip_analytics', 
          label: 'Trip Analytics', 
          description: 'Comprehensive trip planning and performance analysis',
          category: 'analytics',
          requiredFields: ['tripData'],
          supportedCharts: ['line', 'bar', 'pie'],
          sampleDataAvailable: true
        },
        { 
          id: 'packing_analytics', 
          name: 'Packing Analytics', 
          value: 'packing_analytics', 
          label: 'Packing Analytics', 
          description: 'Packing list optimization and item analysis',
          category: 'performance',
          requiredFields: ['packingData'],
          supportedCharts: ['bar', 'pie', 'donut'],
          sampleDataAvailable: true
        },
        { 
          id: 'user_analytics', 
          name: 'User Analytics', 
          value: 'user_analytics', 
          label: 'User Analytics', 
          description: 'User engagement and behavior insights',
          category: 'engagement',
          requiredFields: ['userData'],
          supportedCharts: ['line', 'bar', 'area'],
          sampleDataAvailable: true
        },
        { 
          id: 'eco_impact', 
          name: 'Eco Impact', 
          value: 'eco_impact', 
          label: 'Eco Impact Analytics', 
          description: 'Environmental sustainability metrics and analysis',
          category: 'sustainability',
          requiredFields: ['ecoData'],
          supportedCharts: ['radar', 'bar', 'gauge'],
          sampleDataAvailable: true
        },
        { 
          id: 'budget_analytics', 
          name: 'Budget Analysis', 
          value: 'budget_analytics', 
          label: 'Budget Analytics', 
          description: 'Travel spending patterns and cost optimization',
          category: 'analytics',
          requiredFields: ['budgetData'],
          supportedCharts: ['pie', 'line', 'stacked-bar'],
          sampleDataAvailable: true
        },
        { 
          id: 'destination_analytics', 
          name: 'Destination Analytics', 
          value: 'destination_analytics', 
          label: 'Destination Analytics', 
          description: 'Destination popularity and trend analysis',
          category: 'analytics',
          requiredFields: ['destinationData'],
          supportedCharts: ['bar', 'scatter', 'heatmap'],
          sampleDataAvailable: true
        }
      ],
      reports: [
        {
          _id: '1',
          ownerUid: 'test-user',
          type: 'trip_analytics',
          category: 'analytics',
          title: 'Q3 2024 Travel Analytics Report',
          generatedAt: new Date(Date.now() - 86400000).toISOString(),
          format: 'json',
          isScheduled: false,
          status: 'completed' as const,
          tags: ['quarterly', 'travel'],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          data: {
            summary: ReportHelpers.SummaryGenerator.createTripSummary(ReportHelpers.SampleDataGenerator.generateTripData()),
            charts: [
              ReportHelpers.ChartGenerator.createLineChart('Monthly Trips', [
                { label: 'Jan', value: 120 },
                { label: 'Feb', value: 150 },
                { label: 'Mar', value: 180 }
              ])
            ],
            details: { sections: [], correlations: [], patterns: [], anomalies: [] },
            recommendations: ReportHelpers.RecommendationsGenerator.generateTripRecommendations(),
            insights: ReportHelpers.InsightsGenerator.generateKeyInsights('trip_analytics')
          },
          metadata: {
            version: '1.0',
            generatedBy: 'system',
            generationTime: 2500,
            dataPoints: 1248,
            confidence: 0.92,
            sources: ['trips', 'bookings'],
            lastUpdated: new Date().toISOString()
          }
        },
        {
          _id: '2',
          ownerUid: 'test-user',
          type: 'eco_impact',
          category: 'sustainability',
          title: 'Environmental Impact Analysis',
          generatedAt: new Date(Date.now() - 864000000).toISOString(),
          format: 'json',
          isScheduled: false,
          status: 'processing' as const,
          tags: ['sustainability', 'environmental'],
          createdAt: new Date(Date.now() - 864000000).toISOString(),
          updatedAt: new Date(Date.now() - 864000000).toISOString(),
          metadata: {
            version: '1.0',
            generatedBy: 'system',
            generationTime: 0,
            dataPoints: 0,
            confidence: 0,
            sources: [],
            lastUpdated: new Date().toISOString()
          }
        },
        {
          _id: '3',
          ownerUid: 'test-user',
          type: 'packing_analytics',
          category: 'performance',
          title: 'Weekly Packing Trends Analysis',
          generatedAt: new Date(Date.now() - 604800000).toISOString(),
          format: 'json',
          isScheduled: false,
          status: 'failed' as const,
          tags: ['weekly', 'packing'],
          createdAt: new Date(Date.now() - 604800000).toISOString(),
          updatedAt: new Date(Date.now() - 604800000).toISOString(),
          errorMessage: 'Insufficient data points for analysis',
          metadata: {
            version: '1.0',
            generatedBy: 'system',
            generationTime: 0,
            dataPoints: 5,
            confidence: 0,
            sources: ['packing-lists'],
            lastUpdated: new Date().toISOString()
          }
        }
      ],
      overview: {
        totalReports: 3,
        reportsThisMonth: 2,
        popularTypes: ['trip_analytics', 'eco_impact', 'packing_analytics'],
        recentActivity: [
          { id: '1', type: 'trip_analytics', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
          { id: '2', type: 'eco_impact', createdAt: new Date(Date.now() - 864000000).toISOString(), status: 'processing' }
        ],
        systemHealth: {
          averageGenerationTime: 2500,
          successRate: 0.85,
          errorRate: 0.15
        },
        insights: {
          trending: ['Eco-friendly travel', 'Smart packing', 'Budget optimization'],
          recommendations: ['Increase eco-reporting', 'Automate weekly reports', 'Add more chart types']
        }
      }
    });

  }
}));