import { create } from 'zustand';
import { fetcherWithToken, fetcherWithTokenConfig } from '@/utils/fetcher';
import { 
  Report, 
  ReportGenerateRequest, 
  ReportStore 
} from '@/types';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/export/${id}/${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `report-${id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      set({ loading: false });
    } catch (error) {
      console.error('Failed to export report:', error);
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
        { id: '1', name: 'User Activity Report', description: 'User activity analysis', category: 'Analytics' },
        { id: '2', name: 'Eco Impact Report', description: 'Environmental impact metrics', category: 'Environmental' },
        { id: '3', name: 'Packing Trends Report', description: 'Popular packing items analysis', category: 'Analytics' }
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