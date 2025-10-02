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
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/types`);
      set({ reportTypes: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      console.error('Failed to fetch report types:', error);
      set({ error: 'Failed to fetch report types', loading: false });
    }
  },

  getOverview: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports/overview`);
      set({ overview: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch report overview:', error);
      set({ error: 'Failed to fetch report overview', loading: false });
    }
  },

  fetchReports: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reports`);
      set({ reports: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      console.error('Failed to fetch reports:', error);
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
      set({ reports: currentReports.filter(report => report._id !== id) });
      // Clear selected report if it was the deleted one
      if (get().selectedReport?._id === id) {
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
}));