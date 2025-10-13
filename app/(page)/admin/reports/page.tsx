"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  Download, 
  BarChart as BarIcon, 
  PieChart as PieIcon, 
  Users, 
  FileText,
  Plus,
  RefreshCw,
  Trash2,
  Eye,
  Calendar,
  TrendingUp
} from "lucide-react";
import { useReportStore } from "@/store/reportStore";
import { ReportGenerateRequest } from "@/types";
import StatCard from "@/components/admin/StatCard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const COLORS = ["#34D399", "#10B981", "#059669", "#047857", "#065F46"];
const HOVER_COLORS = ["#6EE7B7", "#34D399", "#2DD4BF", "#22C55E", "#10B981"];

interface ChartData {
  name: string;
  Users?: number;
  value?: number;
}

export default function ReportsPage() {
  const [userActivityData, setUserActivityData] = useState<ChartData[]>([]);
  const [ecoImpactData, setEcoImpactData] = useState<ChartData[]>([]);
  const [topItemsData, setTopItemsData] = useState<ChartData[]>([]);

  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [activeTopItemIndex, setActiveTopItemIndex] = useState<number | null>(null);
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

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
    generateReport,
    deleteReport,
    exportReport,
    injectMockData
  } = useReportStore();

  // UI state for report generation
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<string | null>(null);
  const [testDataLoaded, setTestDataLoaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: "",
      endDate: ""
    },
    includeArchived: false,
    minRecords: "",
    categories: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);

  // Handle report export with different formats
  const handleExportReport = async (reportId: string, format: 'pdf' | 'csv' | 'xlsx' | 'json') => {
    try {
      await exportReport(reportId, format);
    } catch (error) {
      console.error(`Error exporting report as ${format}:`, error);
    }
  };

  // Handle report regeneration
  const handleRegenerateReport = async (reportId: string) => {
    try {
      const { regenerateReport } = useReportStore.getState();
      await regenerateReport(reportId);
    } catch (error) {
      console.error('Error regenerating report:', error);
    }
  };

  useEffect(() => {
    // Initialize report data
    const initializeData = async () => {
      console.log('🔍 Initializing report data...');
      try {
        await Promise.all([
          getTypes(),
          getOverview(),
          fetchReports()
        ]);
        console.log('✅ Report data initialization complete');
      } catch (error) {
        console.error('❌ Error initializing report data:', error);
      }
    };

    initializeData();

    // Set static chart data (this could come from API in the future)
    setUserActivityData([
      { name: "Jan", Users: 45 },
      { name: "Feb", Users: 60 },
      { name: "Mar", Users: 75 },
      { name: "Apr", Users: 50 },
      { name: "May", Users: 90 },
    ]);

    setEcoImpactData([
      { name: "CO₂ Saved", value: 400 },
      { name: "Plastic Avoided", value: 300 },
      { name: "Reusable Items", value: 300 },
      { name: "Waste Reduced", value: 200 },
    ]);

    setTopItemsData([
      { name: "Reusable Bottle", value: 120 },
      { name: "Travel Mug", value: 90 },
      { name: "Solar Charger", value: 80 },
      { name: "Eco Backpack", value: 70 },
      { name: "Bamboo Toothbrush", value: 60 },
    ]);
  }, [getTypes, getOverview, fetchReports, injectMockData]);

  // Debug useEffect to log data changes
  useEffect(() => {
    console.log('📊 Report Types updated:', reportTypes);
    if (reportTypes.length > 0) {
      console.log('✅ Data loaded successfully! Found', reportTypes.length, 'report types');
      // If we have report types and testDataLoaded is false, it means mock data was injected
      if (!testDataLoaded) {
        console.log('📝 Mock data detected - updating testDataLoaded state');
        setTestDataLoaded(true);
      }
    }
  }, [reportTypes, testDataLoaded]);

  useEffect(() => {
    console.log('📈 Overview updated:', overview);
  }, [overview]);

  useEffect(() => {
    console.log('📋 Reports updated:', reports);
  }, [reports]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.custom-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const tooltipStyle = {
    backgroundColor: "#111",
    borderRadius: "8px",
    border: "1px solid #34D399",
    color: "#fff",
    fontSize: "13px",
  };

  const legendStyle = {
    color: "#34D399",
    fontSize: "14px",
  };

  return (
    <section className="px-6 lg:px-10 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-black/70 via-emerald-900/60 to-emerald-950/70 border border-green-700/40 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Reports Dashboard</h1>
            <p className="text-green-300 text-sm">Insights on user activity & eco impact</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition"
          >
            <Plus size={18} /> Generate Report
          </button>
          {/* TEMPORARY: Mock data button for testing */}
          <button 
            onClick={() => {
              console.log('🎭 Loading test data...');
              injectMockData();
              setTestDataLoaded(true);
              console.log('🔄 Test data injection initiated');
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition text-sm ${
              testDataLoaded 
                ? 'bg-green-600 text-white' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {testDataLoaded ? '✅ Data Loaded' : '🎭 Load Test Data'}
          </button>
        </div>
      </motion.div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileText}
            label="Total Reports"
            value={(overview.totalReports || 0).toString()}
          />
          <StatCard
            icon={Calendar}
            label="This Month"
            value={(overview.reportsThisMonth || 0).toString()}
            delta={overview.totalReports && overview.reportsThisMonth ? 
              `+${Math.round((overview.reportsThisMonth / overview.totalReports) * 100)}%` : '+0%'
            }
          />
          <StatCard
            icon={TrendingUp}
            label="Popular Types"
            value={(overview.popularTypes?.length || 0).toString()}
          />
          <StatCard
            icon={Users}
            label="Recent Activity"
            value={(overview.recentActivity?.length || 0).toString()}
          />
        </div>
      )}

      {/* Report Generation Modal */}
      {showGenerateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowGenerateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-black/90 via-emerald-900/30 to-emerald-950/50 border border-green-700/40 rounded-3xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Generate New Report</h3>
            {reportTypes.length === 0 && (
              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-3 mb-4">
                <p className="text-yellow-300 text-sm">
                  ⚠️ No report types available. Close this modal and click the &ldquo;Load Test Data&rdquo; button to populate sample data, then try again.
                </p>
              </div>
            )}
            {reportTypes.length > 0 && testDataLoaded && (
              <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-3 mb-4">
                <p className="text-green-300 text-sm">
                  ✅ Test data loaded! Found {reportTypes.length} report types available for generation.
                </p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-green-300 text-sm mb-2">
                  Report Type {reportTypes.length === 0 && <span className="text-yellow-400">(No types loaded - try &ldquo;Test Data&rdquo; button)</span>}
                </label>
                
                {/* Custom Dropdown - Full Control over styling */}
                <div className="relative custom-dropdown">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full px-3 py-2 bg-gray-800 border border-green-700/30 rounded-xl text-white focus:border-green-500 focus:outline-none text-left flex justify-between items-center"
                  >
                    <span>
                      {selectedReportType 
                        ? (() => {
                            const selectedType = reportTypes.find(t => (t.id || t.value) === selectedReportType);
                            return selectedType?.name || selectedType?.label || 'Unknown';
                          })()
                        : (reportTypes.length === 0 ? 'No report types available' : 'Select a report type')
                      }
                    </span>
                    <svg 
                      className={`fill-current h-4 w-4 text-white transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-green-700/30 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {reportTypes.length === 0 ? (
                        <div className="px-3 py-2 text-gray-400 text-sm">No report types available</div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReportType("");
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-white hover:bg-green-700/20 transition-colors"
                          >
                            Select a report type
                          </button>
                          {reportTypes.map((type, index) => (
                            <button
                              key={(type.id || type.value) || `report-type-${index}`}
                              type="button"
                              onClick={() => {
                                setSelectedReportType(type.id || type.value || '');
                                setDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-white hover:bg-green-700/20 transition-colors border-t border-green-700/20 first:border-t-0"
                            >
                              {type.name || type.label}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-green-300 text-sm mb-2">Report Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-green-700/30 rounded-xl text-white focus:border-green-500 focus:outline-none"
                  placeholder="Enter report title"
                />
              </div>

              {/* Filters Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="block text-green-300 text-sm">Report Filters</label>
                    {(filters.dateRange.startDate || filters.dateRange.endDate || filters.minRecords || filters.includeArchived) && (
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-xs text-green-400 hover:text-green-300 transition"
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
                
                {showFilters && (
                  <div className="space-y-3 p-3 bg-black/20 border border-green-700/20 rounded-xl">
                    {/* Date Range */}
                    <div>
                      <label className="block text-green-300 text-xs mb-1">Date Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={filters.dateRange.startDate}
                          onChange={(e) => setFilters({
                            ...filters,
                            dateRange: { ...filters.dateRange, startDate: e.target.value }
                          })}
                          min="2025-09-01"
                          max={filters.dateRange.endDate || new Date().toISOString().split('T')[0]}
                          className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                          placeholder="Start Date"
                        />
                        <input
                          type="date"
                          value={filters.dateRange.endDate}
                          onChange={(e) => setFilters({
                            ...filters,
                            dateRange: { ...filters.dateRange, endDate: e.target.value }
                          })}
                          min={filters.dateRange.startDate || "2025-09-01"}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                          placeholder="End Date"
                        />
                      </div>
                      <div className="mt-1">
                        <p className="text-green-400 text-xs">
                          Available date range: Sep 1, 2025 - {new Date().toLocaleDateString()}
                        </p>
                        {filters.dateRange.startDate && filters.dateRange.endDate && 
                         new Date(filters.dateRange.startDate) > new Date(filters.dateRange.endDate) && (
                          <p className="text-red-400 text-xs mt-1">
                            ⚠️ Start date cannot be after end date
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-green-300 text-xs mb-1">Min Records</label>
                        <input
                          type="number"
                          value={filters.minRecords}
                          onChange={(e) => setFilters({
                            ...filters,
                            minRecords: e.target.value
                          })}
                          className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                          placeholder="Min records"
                          min="0"
                        />
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id="includeArchived"
                          checked={filters.includeArchived}
                          onChange={(e) => setFilters({
                            ...filters,
                            includeArchived: e.target.checked
                          })}
                          className="mr-2 rounded border-green-700/30 bg-gray-800 text-green-500 focus:ring-green-500"
                        />
                        <label htmlFor="includeArchived" className="text-green-300 text-xs">
                          Include archived data
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowGenerateModal(false);
                    setSelectedReportType("");
                    setReportTitle("");
                    setFilters({
                      dateRange: { startDate: "", endDate: "" },
                      includeArchived: false,
                      minRecords: "",
                      categories: []
                    });
                    setShowFilters(false);
                  }}
                  className="flex-1 px-4 py-2 border border-green-700/40 text-green-300 rounded-xl hover:bg-green-700/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (selectedReportType && reportTitle) {
                      try {
                        // Prepare filters object, only include non-empty values
                        const reportFilters: NonNullable<ReportGenerateRequest['filters']> = {};
                        
                        if (filters.dateRange.startDate || filters.dateRange.endDate) {
                          reportFilters.dateRange = {
                            ...(filters.dateRange.startDate && { startDate: filters.dateRange.startDate }),
                            ...(filters.dateRange.endDate && { endDate: filters.dateRange.endDate })
                          };
                        }
                        
                        if (filters.minRecords) {
                          reportFilters.minRecords = parseInt(filters.minRecords);
                        }
                        
                        if (filters.includeArchived) {
                          reportFilters.includeArchived = filters.includeArchived;
                        }
                        
                        await generateReport({
                          type: selectedReportType,
                          title: reportTitle,
                          filters: reportFilters
                        });
                        
                        // Reset form
                        setShowGenerateModal(false);
                        setSelectedReportType("");
                        setReportTitle("");
                        setFilters({
                          dateRange: { startDate: "", endDate: "" },
                          includeArchived: false,
                          minRecords: "",
                          categories: []
                        });
                        setShowFilters(false);
                      } catch (error) {
                        console.error('Error generating report:', error);
                      }
                    }
                  }}
                  disabled={
                    !selectedReportType || 
                    !reportTitle || 
                    loading ||
                    (Boolean(filters.dateRange.startDate && filters.dateRange.endDate && 
                     new Date(filters.dateRange.startDate) > new Date(filters.dateRange.endDate)))
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reports List */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-semibold text-white">Generated Reports</h2>
          </div>
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-3 py-2 text-green-300 hover:text-white hover:bg-green-700/20 rounded-xl transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="text-green-300">Loading reports...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-400">{error}</div>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="text-center py-8">
            <div className="text-green-300">No reports generated yet</div>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="space-y-3">
            {reports.map((report) => (
              <motion.div
                key={report._id || report.id || Math.random().toString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/20 border border-green-700/20 rounded-2xl p-4 hover:border-green-600/40 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{report.title}</h3>
                    <p className="text-green-300 text-sm">{report.type}</p>
                    <p className="text-green-400 text-xs">
                      Created: {new Date(report.createdAt).toLocaleDateString()}
                      {report.reportAge && <span className="ml-2">({report.reportAge})</span>}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                      report.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                      report.status === 'processing' ? 'bg-yellow-600/20 text-yellow-400' :
                      report.status === 'failed' ? 'bg-red-600/20 text-red-400' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {report.statusDisplay || report.status}
                    </span>
                    {report.tags && report.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {report.tags.slice(0, 3).map((tag, index) => (
                          <span key={`tag-${index}`} className="px-2 py-1 bg-emerald-600/20 text-emerald-300 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <button className="p-2 text-green-300 hover:text-white hover:bg-green-700/20 rounded-lg transition">
                        <Download size={16} />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-black/90 border border-green-700/40 rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="space-y-1 min-w-[80px]">
                          <button
                            onClick={() => handleExportReport(report._id || report.id!, 'json')}
                            className="block w-full text-left px-3 py-2 text-sm text-green-300 hover:text-white hover:bg-green-700/20 rounded-lg transition"
                          >
                            JSON
                          </button>
                          <button
                            onClick={() => handleExportReport(report._id || report.id!, 'csv')}
                            className="block w-full text-left px-3 py-2 text-sm text-green-300 hover:text-white hover:bg-green-700/20 rounded-lg transition"
                          >
                            CSV
                          </button>
                          <button
                            onClick={() => handleExportReport(report._id || report.id!, 'pdf')}
                            className="block w-full text-left px-3 py-2 text-sm text-green-300 hover:text-white hover:bg-green-700/20 rounded-lg transition"
                          >
                            PDF
                          </button>
                          <button
                            onClick={() => handleExportReport(report._id || report.id!, 'xlsx')}
                            className="block w-full text-left px-3 py-2 text-sm text-green-300 hover:text-white hover:bg-green-700/20 rounded-lg transition"
                          >
                            Excel
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingReport(report._id || report.id!)}
                      className="p-2 text-blue-300 hover:text-white hover:bg-blue-700/20 rounded-lg transition"
                      title="View Report"
                    >
                      <Eye size={16} />
                    </button>
                    {report.status === 'completed' && (
                      <button
                        onClick={() => handleRegenerateReport(report._id || report.id!)}
                        className="p-2 text-yellow-300 hover:text-white hover:bg-yellow-700/20 rounded-lg transition"
                        title="Regenerate Report"
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirmId(report._id || report.id!)}
                      className="p-2 text-red-300 hover:text-white hover:bg-red-700/20 rounded-lg transition"
                      title="Delete Report"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Report View Modal */}
      {viewingReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewingReport(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-black/90 via-emerald-900/30 to-emerald-950/50 border border-green-700/40 rounded-3xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const report = reports.find(r => (r._id || r.id) === viewingReport);
              if (!report) return <div className="text-white">Report not found</div>;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{report.title}</h3>
                    <button
                      onClick={() => setViewingReport(null)}
                      className="text-green-300 hover:text-white transition"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Type</label>
                        <div className="text-white">{report.type}</div>
                      </div>
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Status</label>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          report.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                          report.status === 'processing' ? 'bg-yellow-600/20 text-yellow-400' :
                          report.status === 'failed' ? 'bg-red-600/20 text-red-400' :
                          'bg-gray-600/20 text-gray-400'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Generated</label>
                        <div className="text-white">
                          {report.formattedGeneratedAt || new Date(report.generatedAt).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Format</label>
                        <div className="text-white">{report.format}</div>
                      </div>
                    </div>
                    {report.tags && report.tags.length > 0 && (
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {report.tags.map((tag, index) => (
                            <span key={`modal-tag-${index}`} className="px-2 py-1 bg-emerald-600/20 text-emerald-300 rounded-md text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {report.filters && (
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Filters Applied</label>
                        <div className="bg-black/30 border border-green-700/30 rounded-xl p-3">
                          <pre className="text-green-300 text-sm whitespace-pre-wrap">
                            {JSON.stringify(report.filters, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                    {report.data?.summary && (
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Summary Statistics</label>
                        <div className="bg-black/30 border border-green-700/30 rounded-xl p-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(report.data.summary).map(([key, value]) => (
                              value !== 0 && value !== null && value !== undefined && (
                                <div key={`summary-${key}`} className="text-sm">
                                  <div className="text-green-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                  <div className="text-white font-medium">{String(value)}</div>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {report.data?.charts && report.data.charts.length > 0 && (
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Charts Available</label>
                        <div className="bg-black/30 border border-green-700/30 rounded-xl p-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {report.data.charts.map((chart, index) => (
                              <div key={`chart-${index}`} className="border border-green-700/20 rounded-lg p-3">
                                <div className="text-white font-medium text-sm">{chart.title}</div>
                                <div className="text-green-300 text-xs mt-1">
                                  Type: {chart.type.toUpperCase()} | {chart.data.length} data points
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {report.data && (
                      <div>
                        <label className="block text-green-300 text-sm mb-1">Report Data</label>
                        <div className="bg-black/30 border border-green-700/30 rounded-xl p-4 max-h-60 overflow-y-auto">
                          <pre className="text-green-300 text-sm whitespace-pre-wrap">
                            {JSON.stringify(report.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                    {report.errorMessage && (
                      <div>
                        <label className="block text-red-300 text-sm mb-1">Error Message</label>
                        <div className="text-red-400 bg-red-900/20 border border-red-700/30 rounded-xl p-3">
                          {report.errorMessage}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-6 border-t border-green-700/30 mt-6">
                    <button
                      onClick={() => handleExportReport(report._id || report.id!, 'json')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-300 rounded-xl hover:bg-green-600/30 transition"
                    >
                      <Download size={16} />
                      Export JSON
                    </button>
                    <button
                      onClick={() => handleExportReport(report._id || report.id!, 'csv')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-xl hover:bg-blue-600/30 transition"
                    >
                      <Download size={16} />
                      Export CSV
                    </button>
                    <button
                      onClick={() => handleExportReport(report._id || report.id!, 'pdf')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-300 rounded-xl hover:bg-red-600/30 transition"
                    >
                      <Download size={16} />
                      Export PDF
                    </button>
                    <button
                      onClick={() => handleExportReport(report._id || report.id!, 'xlsx')}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-300 rounded-xl hover:bg-purple-600/30 transition"
                    >
                      <Download size={16} />
                      Export Excel
                    </button>
                    {report.status === 'completed' && (
                      <button
                        onClick={() => {
                          handleRegenerateReport(report._id || report.id!);
                          setViewingReport(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 text-yellow-300 rounded-xl hover:bg-yellow-600/30 transition"
                      >
                        <RefreshCw size={16} />
                        Regenerate
                      </button>
                    )}
                    <button
                      onClick={() => setViewingReport(null)}
                      className="flex items-center gap-2 px-4 py-2 border border-green-700/40 text-green-300 rounded-xl hover:bg-green-700/20 transition"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          open={!!deleteConfirmId}
          onCancel={() => setDeleteConfirmId(null)}
          onConfirm={async () => {
            await deleteReport(deleteConfirmId);
            setDeleteConfirmId(null);
          }}
          title="Delete Report"
          description="Are you sure you want to delete this report? This action cannot be undone."
        />
      )}

      {/* User Activity */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BarIcon className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">User Activity</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={userActivityData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            style={{ backgroundColor: "transparent" }}
          >
            <XAxis dataKey="name" stroke="#10B981" />
            <YAxis stroke="#10B981" />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#34D399" }} />
            <Legend wrapperStyle={legendStyle} />
            <Bar
              dataKey="Users"
              radius={[5, 5, 0, 0]}
              onMouseEnter={(_, index) => setActiveBarIndex(index)}
              onMouseLeave={() => setActiveBarIndex(null)}
            >
              {userActivityData.map((entry, index) => (
                <Cell
                  key={`user-activity-cell-${index}`}
                  fill={activeBarIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Eco Impact */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">Eco Impact</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart style={{ backgroundColor: "transparent" }}>
            <Pie
              data={ecoImpactData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              onMouseEnter={(_, index) => setActivePieIndex(index)}
              onMouseLeave={() => setActivePieIndex(null)}
              label={{ fill: "#fff" }}
            >
              {ecoImpactData.map((entry, index) => (
                <Cell
                  key={`eco-impact-cell-${index}`}
                  fill={activePieIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#34D399" }} />
            <Legend wrapperStyle={legendStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Packed Items */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BarIcon className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">Top Packed Items</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={topItemsData}
            layout="vertical"
            margin={{ left: 50 }}
            style={{ backgroundColor: "transparent" }}
          >
            <XAxis type="number" stroke="#10B981" />
            <YAxis dataKey="name" type="category" stroke="#10B981" />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#34D399" }} />
            <Legend wrapperStyle={legendStyle} />
            <Bar
              dataKey="value"
              radius={[5, 5, 5, 5]}
              onMouseEnter={(_, index) => setActiveTopItemIndex(index)}
              onMouseLeave={() => setActiveTopItemIndex(null)}
            >
              {topItemsData.map((entry, index) => (
                <Cell
                  key={`top-items-cell-${index}`}
                  fill={activeTopItemIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
