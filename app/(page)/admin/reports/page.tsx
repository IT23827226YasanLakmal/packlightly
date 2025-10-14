"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
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
import { useAdminStore } from "@/store/adminStore";
import { useProductStore } from "@/store/productStore";
import { useUserStore } from "@/store/userStore";
import { usePostStore } from "@/store/postStore";
import { ReportGenerateRequest } from "@/types";
import StatCard from "@/components/admin/StatCard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#10B981", "#34D399", "#6EE7B7", "#059669", "#047857"];
const HOVER_COLORS = ["#34D399", "#6EE7B7", "#A7F3D0", "#10B981", "#059669"];

// Custom tooltip component for better visibility
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number | string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border-2 border-emerald-400 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
        <p className="text-emerald-400 font-semibold text-sm mb-2">{`${label}`}</p>
        {payload.map((entry, index: number) => (
          <p key={index} className="text-white font-medium">
            <span className="text-emerald-300">{entry.dataKey}:</span>{" "}
            <span className="text-white font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartData {
  name: string;
  Users?: number;
  value?: number;
}

export default function ReportsPage() {
  // Store hooks for dynamic data
  const { loading: adminLoading, fetchAdminStats } = useAdminStore();
  const { products, fetchProducts, loading: productsLoading } = useProductStore();
  const { users, fetchUsers, loading: usersLoading } = useUserStore();
  const { posts, fetchPosts, loading: postsLoading } = usePostStore();

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
  } = useReportStore();

  // Compute dynamic chart data
  const chartData = useMemo(() => {
    // User Activity Data - based on posts created over months
    const userActivityData = [];
    if (posts.length > 0) {
      const monthlyData: { [key: string]: number } = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      months.forEach(month => monthlyData[month] = 0);
      
      posts.forEach(post => {
        if (post.date) {
          const date = new Date(post.date);
          const month = months[date.getMonth()];
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        }
      });

      const currentMonth = new Date().getMonth();
      for (let i = 4; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const month = months[monthIndex];
        userActivityData.push({
          name: month,
          Users: monthlyData[month] || 0
        });
      }
    } else {
      // Fallback data
      userActivityData.push(
        { name: "Jan", Users: 0 },
        { name: "Feb", Users: 0 },
        { name: "Mar", Users: 0 },
        { name: "Apr", Users: 0 },
        { name: "May", Users: 0 }
      );
    }

    // Eco Impact Data - based on product categories and eco scores
    const ecoImpactData = [];
    if (products.length > 0) {
      const categoryData: { [key: string]: { total: number; count: number } } = {};
      
      products.forEach(product => {
        const category = product.category || "Other";
        const ecoScore = product.eco || 0;
        
        if (!categoryData[category]) {
          categoryData[category] = { total: 0, count: 0 };
        }
        
        categoryData[category].total += ecoScore;
        categoryData[category].count += 1;
      });

      const topCategories = Object.entries(categoryData)
        .map(([category, data]) => ({
          name: category,
          value: Math.round(data.total)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);

      ecoImpactData.push(...topCategories);
    } else {
      // Fallback data
      ecoImpactData.push(
        { name: "No Data", value: 0 }
      );
    }

    // Top Items Data - based on most common product names
    const topItemsData = [];
    if (products.length > 0) {
      const itemCounts: { [key: string]: number } = {};
      
      products.forEach(product => {
        const name = product.name || "Unknown Item";
        itemCounts[name] = (itemCounts[name] || 0) + 1;
      });

      const topItems = Object.entries(itemCounts)
        .map(([name, count]) => ({
          name: name.length > 15 ? name.substring(0, 15) + "..." : name,
          value: count
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      topItemsData.push(...topItems);
    } else {
      // Fallback data
      topItemsData.push(
        { name: "No Items", value: 0 }
      );
    }

    return {
      userActivityData,
      ecoImpactData,
      topItemsData
    };
  }, [posts, products]);

  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [activeTopItemIndex, setActiveTopItemIndex] = useState<number | null>(null);
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  // UI state for report generation
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<string | null>(null);
  const [testDataLoaded, setTestDataLoaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Loading states for operations
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: "",
      endDate: ""
    },
    includeArchived: false,
    minRecords: "",
    categories: [] as string[],
    // Backend customization options
    includeOptionalFields: true,
    specificFields: [] as string[],
    lightweight: false,
    // Additional filter options
    userSegments: [] as string[],
    geographicRegions: [] as string[],
    sustainabilityLevels: [] as string[],
    budgetRanges: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handle report export with different formats
  const handleExportReport = async (reportId: string, format: 'pdf' | 'csv' | 'xlsx' | 'json') => {
    if (exportingId || deletingId) return; // Prevent multiple operations
    
    try {
      setExportingId(reportId);
      setExportFormat(format);
      await exportReport(reportId, format);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportingId(null);
      setExportFormat(null);
    }
  };

  // Handle report regeneration
  const handleRegenerateReport = async (reportId: string) => {
    if (regeneratingId || deletingId || exportingId) return; // Prevent multiple operations
    
    try {
      setRegeneratingId(reportId);
      const { regenerateReport } = useReportStore.getState();
      await regenerateReport(reportId);
    } catch (error) {
      console.error('Regeneration failed:', error);
    } finally {
      setRegeneratingId(null);
    }
  };

  useEffect(() => {
    // Initialize report data and fetch dynamic data
    const initializeData = async () => {
      try {
        await Promise.all([
          getTypes(),
          getOverview(),
          fetchReports(),
          fetchAdminStats(),
          fetchProducts(),
          fetchUsers(),
          fetchPosts()
        ]);
      } catch (error) {
        console.error('Error in initialization:', error);
      }
    };

    initializeData();
  }, [getTypes, getOverview, fetchReports, fetchAdminStats, fetchProducts, fetchUsers, fetchPosts]);

  // Debug useEffect to log data changes
  useEffect(() => {

    if (reportTypes.length > 0) {

      // If we have report types and testDataLoaded is false, it means mock data was injected
      if (!testDataLoaded) {

        setTestDataLoaded(true);
      }
    }
  }, [reportTypes, testDataLoaded]);

  useEffect(() => {

  }, [overview]);

  useEffect(() => {

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

  const legendStyle = {
    color: "#34D399",
    fontSize: "14px",
    fontWeight: "500",
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
            <p className="text-green-300 text-sm">
              Real-time insights on user activity & eco impact • 
              {(adminLoading || productsLoading || usersLoading || postsLoading) ? 
                " Loading..." : 
                ` ${products.length} products, ${users.length} users, ${posts.length} posts`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              fetchAdminStats();
              fetchProducts();
              fetchUsers(); 
              fetchPosts();
            }}
            disabled={adminLoading || productsLoading || usersLoading || postsLoading}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition text-sm ${
              adminLoading || productsLoading || usersLoading || postsLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${(adminLoading || productsLoading || usersLoading || postsLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setShowGenerateModal(true)}
            disabled={isGenerating || !!deletingId || !!exportingId || !!regeneratingId}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              isGenerating || !!deletingId || !!exportingId || !!regeneratingId
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus size={18} /> Generate Report
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          label="Total Reports"
          value={loading ? "..." : (overview?.totalReports || reports.length || 0).toString()}
          delta={overview?.totalReports ? `${overview.totalReports} reports` : undefined}
        />
        <StatCard
          icon={Calendar}
          label="Total Products"
          value={productsLoading ? "..." : products.length.toString()}
          delta={!productsLoading && products.length > 0 ? `${products.length} items` : undefined}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Users"
          value={usersLoading ? "..." : users.length.toString()}
          delta={!usersLoading && users.length > 0 ? `${users.length} registered` : undefined}
        />
        <StatCard
          icon={Users}
          label="Community Posts"
          value={postsLoading ? "..." : posts.length.toString()}
          delta={!postsLoading && posts.length > 0 ? `${posts.filter(p => p.status === "Published").length} published` : undefined}
        />
      </div>

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
                    {(filters.dateRange.startDate || filters.dateRange.endDate || filters.minRecords || 
                      filters.includeArchived || !filters.includeOptionalFields || filters.lightweight ||
                      filters.specificFields.length > 0 || filters.categories.length > 0 ||
                      filters.userSegments.length > 0 || filters.geographicRegions.length > 0 ||
                      filters.sustainabilityLevels.length > 0 || filters.budgetRanges.length > 0) && (
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

                    {/* Basic Filters */}
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

                    {/* Report Customization Options */}
                    <div className="border-t border-green-700/20 pt-3">
                      <label className="block text-green-300 text-xs mb-2">Report Customization</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="includeOptionalFields"
                            checked={filters.includeOptionalFields}
                            onChange={(e) => setFilters({
                              ...filters,
                              includeOptionalFields: e.target.checked
                            })}
                            className="mr-2 rounded border-green-700/30 bg-gray-800 text-green-500 focus:ring-green-500"
                          />
                          <label htmlFor="includeOptionalFields" className="text-green-300 text-xs">
                            Include optional fields
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="lightweight"
                            checked={filters.lightweight}
                            onChange={(e) => setFilters({
                              ...filters,
                              lightweight: e.target.checked
                            })}
                            className="mr-2 rounded border-green-700/30 bg-gray-800 text-green-500 focus:ring-green-500"
                          />
                          <label htmlFor="lightweight" className="text-green-300 text-xs">
                            Lightweight report
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <div className="border-t border-green-700/20 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="text-xs text-green-400 hover:text-green-300 transition flex items-center gap-1"
                      >
                        {showAdvancedFilters ? '▼' : '▶'} Advanced Filters
                      </button>
                      
                      {showAdvancedFilters && (
                        <div className="mt-3 space-y-3 p-3 bg-black/10 border border-green-700/10 rounded-lg">
                          {/* Specific Fields Input */}
                          <div>
                            <label className="block text-green-300 text-xs mb-1">
                              Specific Fields (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={filters.specificFields.join(', ')}
                              onChange={(e) => setFilters({
                                ...filters,
                                specificFields: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                              })}
                              className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                              placeholder="e.g., title, date, status"
                            />
                          </div>

                          {/* Categories Input */}
                          <div>
                            <label className="block text-green-300 text-xs mb-1">
                              Categories (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={filters.categories.join(', ')}
                              onChange={(e) => setFilters({
                                ...filters,
                                categories: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                              })}
                              className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                              placeholder="e.g., trip, eco, budget"
                            />
                          </div>

                          {/* Additional Filter Categories */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-green-300 text-xs mb-1">
                                User Segments
                              </label>
                              <input
                                type="text"
                                value={filters.userSegments.join(', ')}
                                onChange={(e) => setFilters({
                                  ...filters,
                                  userSegments: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                })}
                                className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                                placeholder="e.g., premium, basic"
                              />
                            </div>
                            <div>
                              <label className="block text-green-300 text-xs mb-1">
                                Geographic Regions
                              </label>
                              <input
                                type="text"
                                value={filters.geographicRegions.join(', ')}
                                onChange={(e) => setFilters({
                                  ...filters,
                                  geographicRegions: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                                })}
                                className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                                placeholder="e.g., Asia, Europe"
                              />
                            </div>
                            <div>
                              <label className="block text-green-300 text-xs mb-1">
                                Sustainability Levels
                              </label>
                              <input
                                type="text"
                                value={filters.sustainabilityLevels.join(', ')}
                                onChange={(e) => setFilters({
                                  ...filters,
                                  sustainabilityLevels: e.target.value.split(',').map(l => l.trim()).filter(l => l)
                                })}
                                className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                                placeholder="e.g., high, medium, low"
                              />
                            </div>
                            <div>
                              <label className="block text-green-300 text-xs mb-1">
                                Budget Ranges
                              </label>
                              <input
                                type="text"
                                value={filters.budgetRanges.join(', ')}
                                onChange={(e) => setFilters({
                                  ...filters,
                                  budgetRanges: e.target.value.split(',').map(b => b.trim()).filter(b => b)
                                })}
                                className="w-full px-2 py-1 bg-gray-800 border border-green-700/30 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                                placeholder="e.g., 0-500, 500-1000"
                              />
                            </div>
                          </div>
                        </div>
                      )}
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
                      categories: [],
                      includeOptionalFields: true,
                      specificFields: [],
                      lightweight: false,
                      userSegments: [],
                      geographicRegions: [],
                      sustainabilityLevels: [],
                      budgetRanges: []
                    });
                    setShowFilters(false);
                    setShowAdvancedFilters(false);
                  }}
                  className="flex-1 px-4 py-2 border border-green-700/40 text-green-300 rounded-xl hover:bg-green-700/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (selectedReportType && reportTitle && !isGenerating) {
                      try {
                        setIsGenerating(true);
                        // Prepare filters object to match backend expectations
                        const reportFilters: NonNullable<ReportGenerateRequest['filters']> = {};
                        
                        // Core filters
                        if (filters.dateRange.startDate && filters.dateRange.endDate) {
                          reportFilters.dateRange = {
                            startDate: filters.dateRange.startDate,
                            endDate: filters.dateRange.endDate,
                            preset: 'custom'
                          };
                        }
                        
                        if (filters.minRecords) {
                          reportFilters.minRecords = parseInt(filters.minRecords);
                        }
                        
                        if (filters.includeArchived) {
                          reportFilters.includeArchived = filters.includeArchived;
                        }

                        if (filters.categories.length > 0) {
                          reportFilters.categories = filters.categories;
                        }

                        // Backend customization options - these will be extracted by your backend
                        if (!filters.includeOptionalFields) {
                          reportFilters.includeOptionalFields = filters.includeOptionalFields;
                        }

                        if (filters.specificFields.length > 0) {
                          reportFilters.specificFields = filters.specificFields;
                        }

                        if (filters.lightweight) {
                          reportFilters.lightweight = filters.lightweight;
                        }

                        // Additional filter categories
                        if (filters.userSegments.length > 0) {
                          reportFilters.userSegments = filters.userSegments;
                        }

                        if (filters.geographicRegions.length > 0) {
                          reportFilters.geographicRegions = filters.geographicRegions;
                        }

                        if (filters.sustainabilityLevels.length > 0) {
                          reportFilters.sustainabilityLevels = filters.sustainabilityLevels;
                        }

                        if (filters.budgetRanges.length > 0) {
                          reportFilters.budgetRanges = filters.budgetRanges;
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
                          categories: [],
                          includeOptionalFields: true,
                          specificFields: [],
                          lightweight: false,
                          userSegments: [],
                          geographicRegions: [],
                          sustainabilityLevels: [],
                          budgetRanges: []
                        });
                        setShowFilters(false);
                        setShowAdvancedFilters(false);
                      } catch (error) {
                        console.error('Generation failed:', error);
                      } finally {
                        setIsGenerating(false);
                      }
                    }
                  }}
                  disabled={
                    !selectedReportType || 
                    !reportTitle || 
                    loading ||
                    isGenerating ||
                    (Boolean(filters.dateRange.startDate && filters.dateRange.endDate && 
                     new Date(filters.dateRange.startDate) > new Date(filters.dateRange.endDate)))
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition disabled:opacity-50"
                >
                  {(loading || isGenerating) ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    'Generate'
                  )}
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
            onClick={() => fetchReports()}
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
                      <button 
                        disabled={deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)}
                        className={`p-2 rounded-lg transition ${
                          deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)
                            ? 'text-gray-500 bg-gray-700/20 cursor-not-allowed'
                            : 'text-green-300 hover:text-white hover:bg-green-700/20'
                        }`}
                      >
                        {exportingId === (report._id || report.id!) ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>
                      {!(deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)) && (
                        <div className="absolute right-0 top-full mt-1 bg-black/90 border border-green-700/40 rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="space-y-1 min-w-[80px]">
                            <button
                              onClick={() => handleExportReport(report._id || report.id!, 'json')}
                              disabled={exportingId === (report._id || report.id!) && exportFormat === 'json'}
                              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition ${
                                exportingId === (report._id || report.id!) && exportFormat === 'json'
                                  ? 'text-gray-500 bg-gray-700/20 cursor-not-allowed'
                                  : 'text-green-300 hover:text-white hover:bg-green-700/20'
                              }`}
                            >
                              {exportingId === (report._id || report.id!) && exportFormat === 'json' ? (
                                <span className="flex items-center gap-2">
                                  <RefreshCw size={12} className="animate-spin" />
                                  JSON
                                </span>
                              ) : (
                                'JSON'
                              )}
                            </button>
                            <button
                              onClick={() => handleExportReport(report._id || report.id!, 'csv')}
                              disabled={exportingId === (report._id || report.id!) && exportFormat === 'csv'}
                              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition ${
                                exportingId === (report._id || report.id!) && exportFormat === 'csv'
                                  ? 'text-gray-500 bg-gray-700/20 cursor-not-allowed'
                                  : 'text-green-300 hover:text-white hover:bg-green-700/20'
                              }`}
                            >
                              {exportingId === (report._id || report.id!) && exportFormat === 'csv' ? (
                                <span className="flex items-center gap-2">
                                  <RefreshCw size={12} className="animate-spin" />
                                  CSV
                                </span>
                              ) : (
                                'CSV'
                              )}
                            </button>
                            <button
                              onClick={() => handleExportReport(report._id || report.id!, 'pdf')}
                              disabled={exportingId === (report._id || report.id!) && exportFormat === 'pdf'}
                              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition ${
                                exportingId === (report._id || report.id!) && exportFormat === 'pdf'
                                  ? 'text-gray-500 bg-gray-700/20 cursor-not-allowed'
                                  : 'text-green-300 hover:text-white hover:bg-green-700/20'
                              }`}
                            >
                              {exportingId === (report._id || report.id!) && exportFormat === 'pdf' ? (
                                <span className="flex items-center gap-2">
                                  <RefreshCw size={12} className="animate-spin" />
                                  PDF
                                </span>
                              ) : (
                                'PDF'
                              )}
                            </button>
                            <button
                              onClick={() => handleExportReport(report._id || report.id!, 'xlsx')}
                              disabled={exportingId === (report._id || report.id!) && exportFormat === 'xlsx'}
                              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition ${
                                exportingId === (report._id || report.id!) && exportFormat === 'xlsx'
                                  ? 'text-gray-500 bg-gray-700/20 cursor-not-allowed'
                                  : 'text-green-300 hover:text-white hover:bg-green-700/20'
                              }`}
                            >
                              {exportingId === (report._id || report.id!) && exportFormat === 'xlsx' ? (
                                <span className="flex items-center gap-2">
                                  <RefreshCw size={12} className="animate-spin" />
                                  Excel
                                </span>
                              ) : (
                                'Excel'
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setViewingReport(report._id || report.id!)}
                      disabled={deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)}
                      className={`p-2 rounded-lg transition ${
                        deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)
                          ? 'text-gray-500 bg-gray-700/20 cursor-not-allowed'
                          : 'text-blue-300 hover:text-white hover:bg-blue-700/20'
                      }`}
                      title="View Report"
                    >
                      <Eye size={16} />
                    </button>
                    {report.status === 'completed' && (
                      <button
                        onClick={() => handleRegenerateReport(report._id || report.id!)}
                        disabled={deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)}
                        className={`p-2 rounded-lg transition ${
                          deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)
                            ? 'text-gray-500 bg-gray-700/20 cursor-not-allowed'
                            : 'text-yellow-300 hover:text-white hover:bg-yellow-700/20'
                        }`}
                        title="Regenerate Report"
                      >
                        {regeneratingId === (report._id || report.id!) ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirmId(report._id || report.id!)}
                      disabled={deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)}
                      className={`p-2 rounded-lg transition ${
                        deletingId === (report._id || report.id!) || exportingId === (report._id || report.id!) || regeneratingId === (report._id || report.id!)
                          ? 'text-gray-500 bg-gray-700/20 cursor-not-allowed'
                          : 'text-red-300 hover:text-white hover:bg-red-700/20'
                      }`}
                      title="Delete Report"
                    >
                      {deletingId === (report._id || report.id!) ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
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
                      disabled={exportingId === (report._id || report.id!) && exportFormat === 'json'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                        exportingId === (report._id || report.id!) && exportFormat === 'json'
                          ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600/20 text-green-300 hover:bg-green-600/30'
                      }`}
                    >
                      {exportingId === (report._id || report.id!) && exportFormat === 'json' ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      {exportingId === (report._id || report.id!) && exportFormat === 'json' ? 'Exporting...' : 'Export JSON'}
                    </button>
                    <button
                      onClick={() => handleExportReport(report._id || report.id!, 'csv')}
                      disabled={exportingId === (report._id || report.id!) && exportFormat === 'csv'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                        exportingId === (report._id || report.id!) && exportFormat === 'csv'
                          ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30'
                      }`}
                    >
                      {exportingId === (report._id || report.id!) && exportFormat === 'csv' ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      {exportingId === (report._id || report.id!) && exportFormat === 'csv' ? 'Exporting...' : 'Export CSV'}
                    </button>
                    <button
                      onClick={() => handleExportReport(report._id || report.id!, 'pdf')}
                      disabled={exportingId === (report._id || report.id!) && exportFormat === 'pdf'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                        exportingId === (report._id || report.id!) && exportFormat === 'pdf'
                          ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                          : 'bg-red-600/20 text-red-300 hover:bg-red-600/30'
                      }`}
                    >
                      {exportingId === (report._id || report.id!) && exportFormat === 'pdf' ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      {exportingId === (report._id || report.id!) && exportFormat === 'pdf' ? 'Exporting...' : 'Export PDF'}
                    </button>
                    <button
                      onClick={() => handleExportReport(report._id || report.id!, 'xlsx')}
                      disabled={exportingId === (report._id || report.id!) && exportFormat === 'xlsx'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                        exportingId === (report._id || report.id!) && exportFormat === 'xlsx'
                          ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                      }`}
                    >
                      {exportingId === (report._id || report.id!) && exportFormat === 'xlsx' ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      {exportingId === (report._id || report.id!) && exportFormat === 'xlsx' ? 'Exporting...' : 'Export Excel'}
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
          loading={!!deletingId}
          onCancel={() => setDeleteConfirmId(null)}
          onConfirm={async () => {
            if (deletingId || exportingId) return; // Prevent multiple operations
            
            try {
              setDeletingId(deleteConfirmId);
              await deleteReport(deleteConfirmId);
              setDeleteConfirmId(null);
            } catch (error) {
              console.error('Delete failed:', error);
            } finally {
              setDeletingId(null);
            }
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
          {(postsLoading || adminLoading) && (
            <RefreshCw className="w-4 h-4 text-emerald-300 animate-spin ml-2" />
          )}
        </div>
        {(postsLoading || adminLoading) ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-green-300 text-sm">Loading activity data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData.userActivityData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              style={{ backgroundColor: "transparent" }}
            >
              <XAxis dataKey="name" stroke="#10B981" />
              <YAxis stroke="#10B981" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle} />
              <Bar
                dataKey="Users"
                radius={[5, 5, 0, 0]}
                onMouseEnter={(_, index) => setActiveBarIndex(index)}
                onMouseLeave={() => setActiveBarIndex(null)}
              >
                {chartData.userActivityData.map((entry: ChartData, index: number) => (
                  <Cell
                    key={`user-activity-cell-${index}`}
                    fill={activeBarIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Eco Impact */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">Category Eco Impact</h2>
          {(productsLoading || adminLoading) && (
            <RefreshCw className="w-4 h-4 text-emerald-300 animate-spin ml-2" />
          )}
        </div>
        {(productsLoading || adminLoading) ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-green-300 text-sm">Loading eco impact data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart style={{ backgroundColor: "transparent" }}>
              <Pie
                data={chartData.ecoImpactData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                onMouseEnter={(_, index) => setActivePieIndex(index)}
                onMouseLeave={() => setActivePieIndex(null)}
                label={{
                  fill: "#ffffff",
                  fontSize: 12,
                  fontWeight: "600",
                  stroke: "#000000",
                  strokeWidth: 0.5
                }}
              >
                {chartData.ecoImpactData.map((entry: ChartData, index: number) => (
                  <Cell
                    key={`eco-impact-cell-${index}`}
                    fill={activePieIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                  borderRadius: "12px",
                  border: "2px solid #34D399",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "12px 16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                }}
                labelStyle={{ color: "#34D399", fontWeight: "600", fontSize: "16px" }}
                formatter={(value, name) => [
                  <span key="value" style={{ color: "#ffffff", fontWeight: "600" }}>{value} eco points</span>,
                  <span key="name" style={{ color: "#6EE7B7" }}>Category: {name}</span>
                ]}
              />
              <Legend wrapperStyle={legendStyle} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Packed Items */}
      <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-green-700/30 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BarIcon className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">Most Common Products</h2>
          {(productsLoading || adminLoading) && (
            <RefreshCw className="w-4 h-4 text-emerald-300 animate-spin ml-2" />
          )}
        </div>
        {(productsLoading || adminLoading) ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-green-300 text-sm">Loading product data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData.topItemsData}
              layout="vertical"
              margin={{ left: 50 }}
              style={{ backgroundColor: "transparent" }}
            >
              <XAxis type="number" stroke="#10B981" />
              <YAxis dataKey="name" type="category" stroke="#10B981" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                  borderRadius: "12px",
                  border: "2px solid #34D399",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "12px 16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                }}
                labelStyle={{ color: "#34D399", fontWeight: "600", fontSize: "16px" }}
                formatter={(value) => [
                  <span key="value" style={{ color: "#ffffff", fontWeight: "600" }}>{value} instances</span>,
                  <span key="type" style={{ color: "#6EE7B7" }}>Product frequency</span>
                ]}
                labelFormatter={(label) => `Product: ${label}`}
              />
              <Legend wrapperStyle={legendStyle} />
              <Bar
                dataKey="value"
                radius={[5, 5, 5, 5]}
                onMouseEnter={(_, index) => setActiveTopItemIndex(index)}
                onMouseLeave={() => setActiveTopItemIndex(null)}
              >
                {chartData.topItemsData.map((entry: ChartData, index: number) => (
                  <Cell
                    key={`top-items-cell-${index}`}
                    fill={activeTopItemIndex === index ? HOVER_COLORS[index % HOVER_COLORS.length] : COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
