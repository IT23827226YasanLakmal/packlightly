import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig, getToken } from '@/utils/fetcher';
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
    console.log('🔍 Fetching report types...');
    set({ loading: true, error: null });
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/types`);
      console.log('✅ Report types response:', response);
      
      // Handle different response structures
      let typesData = response;
      if (response.success && response.data) {
        typesData = response.data;
      }
      
      set({ reportTypes: Array.isArray(typesData) ? typesData : [], loading: false });
    } catch (error) {
      console.error('❌ Failed to fetch report types:', error);
      set({ error: 'Failed to fetch report types', loading: false });
    }
  },

  getOverview: async () => {
    console.log('🔍 Fetching report overview...');
    set({ loading: true, error: null });
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/overview`);
      console.log('✅ Report overview response:', response);
      
      // Handle different response structures
      let overviewData = response;
      if (response.success && response.data) {
        overviewData = response.data;
      }
      
      set({ overview: overviewData, loading: false });
    } catch (error) {
      console.error('❌ Failed to fetch report overview:', error);
      set({ error: 'Failed to fetch report overview', loading: false });
    }
  },

  fetchReports: async () => {
    console.log('🔍 Fetching reports list...');
    set({ loading: true, error: null });
    try {
      const response = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports`);
      console.log('✅ Reports response received:', response);
      
      // Handle different response structures
      let reportsData = response;
      if (response.success && response.data) {
        reportsData = response.data; // Extract data array from API response
      }
      
      console.log('📊 Processed reports data:', reportsData);
      set({ reports: Array.isArray(reportsData) ? reportsData : [], loading: false });
    } catch (error) {
      console.error('❌ Failed to fetch reports:', error);
      set({ error: 'Failed to fetch reports', loading: false });
    }
  },

  generateReport: async (request: ReportGenerateRequest) => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/generate`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      set({ loading: false });
      // Refresh reports list to include the new report
      await get().fetchReports();
      return data.id || data._id; // Return the report ID
    } catch (error) {
      console.error('Failed to generate report:', error);
      set({ error: 'Failed to generate report', loading: false });
      throw error;
    }
  },

  generateReportSync: async (request: ReportGenerateRequest) => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/generate-sync`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      set({ loading: false });
      // Refresh reports list to include the new report
      await get().fetchReports();
      return data as Report;
    } catch (error) {
      console.error('Failed to generate report synchronously:', error);
      set({ error: 'Failed to generate report synchronously', loading: false });
      throw error;
    }
  },

  getReport: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`);
      set({ selectedReport: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch report:', error);
      set({ error: 'Failed to fetch report', loading: false });
    }
  },

  regenerateReport: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/regenerate`, {
        method: 'POST',
      });
      set({ loading: false });
      // Refresh the specific report and reports list
      await get().getReport(id);
      await get().fetchReports();
    } catch (error) {
      console.error('Failed to regenerate report:', error);
      set({ error: 'Failed to regenerate report', loading: false });
    }
  },

  exportReport: async (id: string, format: string) => {
    set({ loading: true, error: null });
    try {
      console.log(`🔐 Attempting to export report ${id} as ${format}...`);
      
      // Get Firebase ID token properly
      const token = await getToken();
      console.log('🔍 Token received:', token ? `${token.substring(0, 50)}...` : 'null');
      
      if (!token) {
        console.error('❌ No authentication token available');
        throw new Error('No authentication token available');
      }

      // Validate token format (Firebase JWT tokens should have 3 parts separated by dots)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('❌ Invalid token format. Expected JWT with 3 parts, got:', tokenParts.length);
        throw new Error('Invalid token format');
      }

      console.log('📡 Making export request to:', `${process.env.NEXT_PUBLIC_API_URL}/reports/export/${id}/${format}`);
      
      // Don't set Content-Type for file downloads - let the server set it
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/export/${id}/${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📋 Response status:', response.status);
      console.log('📋 Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Export failed:', response.status, errorText);
        throw new Error(`Failed to export report: ${response.status} ${errorText}`);
      }

      // Get the content-type from response to determine file extension
      const contentType = response.headers.get('content-type') || '';
      console.log('📄 Content type:', contentType);

      // Map format to proper file extension
      const getFileExtension = (format: string, contentType: string) => {
        switch (format.toLowerCase()) {
          case 'csv':
            return 'csv';
          case 'json':
            return 'json';
          default:
            // Try to determine from content-type
            if (contentType.includes('json')) return 'json';
            if (contentType.includes('csv')) return 'csv';
            return format; // fallback
        }
      };

      const fileExtension = getFileExtension(format, contentType);
      const filename = `report-${id}.${fileExtension}`;

      // Handle file download
      const blob = await response.blob();
      console.log('📦 Blob size:', blob.size, 'bytes');
      console.log('📦 Blob type:', blob.type);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      
      console.log('💾 Downloading file:', filename);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('✅ Export completed successfully');
      set({ loading: false });
    } catch (error) {
      console.error('❌ Failed to export report:', error);
      set({ error: 'Failed to export report', loading: false });
    }
  },

  deleteReport: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
        method: 'DELETE',
      });
      set({ loading: false });
      // Remove the deleted report from the local state
      const currentReports = get().reports;
      set({ reports: currentReports.filter(report => (report._id || report.id) !== id) });
      // Clear selected report if it was the deleted one
      if ((get().selectedReport?._id || get().selectedReport?.id) === id) {
        set({ selectedReport: null });
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
      set({ error: 'Failed to delete report', loading: false });
    }
  },

  setSelectedReport: (report: Report | null) => {
    set({ selectedReport: report });
  },

  // TEMPORARY: For testing purposes only
  injectMockData: () => {
    console.log('🎭 Injecting mock data for testing...');
    set({
      reportTypes: [
        { value: 'trip_analytics', label: 'Trip Analytics', description: 'Analyze your trip patterns and trends' },
        { value: 'packing_statistics', label: 'Packing Statistics', description: 'Statistics on your packing lists and items' },
        { value: 'user_activity', label: 'User Activity', description: 'Your activity and engagement metrics' },
        { value: 'eco_impact', label: 'Eco Impact', description: 'Environmental impact of your travel choices' },
        { value: 'budget_analysis', label: 'Budget Analysis', description: 'Analysis of your travel spending patterns' },
        { value: 'destination_trends', label: 'Destination Trends', description: 'Popular destinations and travel trends' }
      ],
      reports: [
        {
          _id: '1',
          ownerUid: 'test-user',
          type: 'user_activity',
          title: 'Monthly User Activity Report - October 2025',
          generatedAt: new Date().toISOString(),
          format: 'json',
          isScheduled: false,
          status: 'completed' as const,
          tags: ['monthly', 'activity'],
          data: { 
            summary: { totalUsers: 150, activeUsers: 120, newRegistrations: 25 },
            charts: [
              {
                type: 'bar',
                title: 'User Growth',
                data: [120, 150, 180],
                labels: ['Month 1', 'Month 2', 'Month 3']
              }
            ]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          ownerUid: 'test-user',
          type: 'eco_impact',
          title: 'Environmental Impact Analysis',
          generatedAt: new Date(Date.now() - 86400000).toISOString(),
          format: 'json',
          isScheduled: false,
          status: 'processing' as const,
          tags: ['environment', 'sustainability'],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          ownerUid: 'test-user',
          type: 'packing_statistics',
          title: 'Weekly Packing Trends Analysis',
          generatedAt: new Date(Date.now() - 172800000).toISOString(),
          format: 'json',
          isScheduled: false,
          status: 'failed' as const,
          tags: ['packing', 'trends'],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          errorMessage: 'Insufficient data for analysis'
        }
      ],
      overview: {
        totalReports: 15,
        reportsThisMonth: 8,
        popularTypes: ['User Activity Report', 'Eco Impact Report', 'Packing Trends Report'],
        recentActivity: [
          { id: '1', type: 'User Activity Report', createdAt: new Date().toISOString(), status: 'completed' },
          { id: '2', type: 'Eco Impact Report', createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'processing' }
        ]
      }
    });
  },
}));