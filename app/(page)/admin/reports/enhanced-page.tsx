"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  BarChart as BarIcon, 
  PieChart as PieIcon, 
  FileText,
  Plus,
  RefreshCw,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  Database,
  Sparkles,
  Filter
} from "lucide-react";
import { useReportStore } from "@/store/reportStore";
import { ReportGenerateRequest, Report } from "@/types";
import StatCard from "@/components/admin/StatCard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EnhancedChart from "@/components/reports/EnhancedChart";
import SampleDataGenerator from "@/components/reports/SampleDataGenerator";

export default function EnhancedReportsPage() {
  // Report store hooks
  const {
    reports,
    reportTypes,
    overview,
    loading,
    error,
    getTypes,
    getOverview,
    fetchReports,
    generateEnhancedReport,
    deleteReport,
    exportReport,
    injectMockData
  } = useReportStore();

  // UI state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSampleGenerator, setShowSampleGenerator] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: "",
      endDate: ""
    },
    includeArchived: false,
    categories: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Inject mock data first for demo purposes
        injectMockData();
        
        // Then try to fetch real data
        await Promise.all([
          getTypes(),
          getOverview(),
          fetchReports()
        ]);
      } catch (error) {
        console.error('Failed to initialize reports data:', error);
      }
    };

    initializeData();
  }, [getTypes, getOverview, fetchReports, injectMockData]);

  // Handle report generation
  const handleGenerateReport = async () => {
    if (!selectedReportType || !reportTitle) return;

    try {
      const request: ReportGenerateRequest = {
        type: selectedReportType,
        title: reportTitle,
        options: {
          includeAI: true,
          generateInsights: true,
          includeRecommendations: true,
          chartTypes: ['line', 'bar', 'pie', 'radar']
        }
      };

      await generateEnhancedReport(request);
      setShowGenerateModal(false);
      setSelectedReportType("");
      setReportTitle("");
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  // Handle report export
  const handleExportReport = async (reportId: string, format: 'json' | 'pdf' | 'csv' | 'xlsx') => {
    try {
      await exportReport(reportId, format);
    } catch (error) {
      console.error(`Error exporting report as ${format}:`, error);
    }
  };

  // Handle report deletion
  const handleDeleteReport = async (id: string) => {
    try {
      await deleteReport(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const formatReportAge = (date: string) => {
    const now = new Date();
    const reportDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      <div className="px-6 lg:px-10 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-900 via-black to-emerald-950 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-400 rounded-xl flex items-center justify-center">
                <BarIcon className="w-6 h-6 text-emerald-900" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Enhanced Reports Dashboard</h1>
                <p className="text-emerald-300 text-sm">
                  AI-powered analytics and insights across all PackLightly modules
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSampleGenerator(!showSampleGenerator)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all"
              >
                <Database className="w-4 h-4" />
                Sample Data
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGenerateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Report
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          <StatCard 
            icon={FileText} 
            label="Total Reports" 
            value={overview?.totalReports?.toString() || "0"} 
            delta="+12%" 
          />
          <StatCard 
            icon={Calendar} 
            label="This Month" 
            value={overview?.reportsThisMonth?.toString() || "0"} 
            delta="+8%" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Success Rate" 
            value={`${((overview?.systemHealth?.successRate || 0) * 100).toFixed(0)}%`} 
            delta="+2%" 
          />
          <StatCard 
            icon={Sparkles} 
            label="AI Insights" 
            value="Active" 
            delta="New!" 
          />
        </motion.div>

        {/* Sample Data Generator */}
        {showSampleGenerator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <SampleDataGenerator />
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Report Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.startDate}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, startDate: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.endDate}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, endDate: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => fetchReports(filters)}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Reports</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchReports()}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">No reports found</p>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Create Your First Report
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <div key={report._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{report.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatReportAge(report.generatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <BarIcon className="w-4 h-4" />
                          {report.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {report.data?.summary && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {report.data.summary.primary?.length || 0} metrics
                          </span>
                        )}
                        {report.data?.charts && (
                          <span className="flex items-center gap-1">
                            <PieIcon className="w-4 h-4" />
                            {report.data.charts.length} charts
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingReport(report)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative group">
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <div className="py-1">
                            {['json', 'pdf', 'csv', 'xlsx'].map((format) => (
                              <button
                                key={format}
                              onClick={() => handleExportReport(report._id!, format as 'json' | 'pdf' | 'csv' | 'xlsx')}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                              >
                                Export as {format.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteConfirmId(report._id!)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Generate New Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Type
                </label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a report type</option>
                  {reportTypes.map((type) => (
                    <option key={type.id} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={!selectedReportType || !reportTitle}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                Generate
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Report Modal */}
      {viewingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{viewingReport.title}</h3>
              <button
                onClick={() => setViewingReport(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            {viewingReport.data?.charts && viewingReport.data.charts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {viewingReport.data.charts.map((chart, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <EnhancedChart config={chart} theme="light" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <ConfirmDialog
          open={true}
          title="Delete Report"
          description="Are you sure you want to delete this report? This action cannot be undone."
          onConfirm={() => handleDeleteReport(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}