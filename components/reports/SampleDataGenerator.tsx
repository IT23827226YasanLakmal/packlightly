"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Play, RefreshCw, Database, FileText } from 'lucide-react';
import { useReportStore } from '@/store/reportStore';
import { Report, MetricItem, ChartConfiguration, RecommendationItem } from '@/types';
import EnhancedChart from './EnhancedChart';

interface SampleDataGeneratorProps {
  className?: string;
}

/**
 * Sample Data Generator Component for testing all 8 report types
 */
export default function SampleDataGenerator({ className = "" }: SampleDataGeneratorProps) {
  const [selectedType, setSelectedType] = useState<string>('trip_analytics');
  const [generating, setGenerating] = useState(false);
  const [sampleReport, setSampleReport] = useState<Report | null>(null);
  
  const { generateSampleReport, validateReportData } = useReportStore();

  const reportTypes = [
    { id: 'trip_analytics', name: 'Trip Analytics', description: 'Travel patterns and destination trends' },
    { id: 'packing_analytics', name: 'Packing Analytics', description: 'Packing optimization and item usage' },
    { id: 'user_analytics', name: 'User Analytics', description: 'User engagement and behavior insights' },
    { id: 'eco_impact', name: 'Eco Impact', description: 'Environmental sustainability metrics' },
    { id: 'budget_analytics', name: 'Budget Analytics', description: 'Travel spending and cost analysis' },
    { id: 'destination_analytics', name: 'Destination Analytics', description: 'Destination popularity and trends' },
    { id: 'inventory_analytics', name: 'Inventory Analytics', description: 'Product inventory and usage stats' },
    { id: 'news_analytics', name: 'News Analytics', description: 'Content engagement and performance' }
  ];

  const generateSampleData = async () => {
    setGenerating(true);
    try {
      console.log('🧪 Generating sample data for:', selectedType);
      
      // Generate sample report
      const report = await generateSampleReport(selectedType);
      setSampleReport(report);
      
      // Validate the generated data
      if (report.data && validateReportData(report.data)) {
        console.log('✅ Sample data validation passed');
      } else {
        console.warn('⚠️ Sample data validation failed');
      }
      
    } catch (error) {
      console.error('❌ Failed to generate sample data:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadSampleData = () => {
    if (!sampleReport) return;
    
    const dataStr = JSON.stringify(sampleReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample-${selectedType}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    setSampleReport(null);
    generateSampleData();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
            Sample Data Generator
          </h2>
        </div>
        <p className="text-emerald-700 dark:text-emerald-300 text-sm">
          Generate realistic sample data for testing all 8 standardized report types. 
          This tool helps developers and testers validate report formats and visualizations.
        </p>
      </motion.div>

      {/* Report Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Select Report Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reportTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                selectedType === type.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="font-medium text-sm mb-1">{type.name}</div>
              <div className="text-xs opacity-75">{type.description}</div>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateSampleData}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {generating ? 'Generating...' : 'Generate Sample Data'}
          </motion.button>

          {sampleReport && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={refreshData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadSampleData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download JSON
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Sample Report Display */}
      {sampleReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Report Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Generated Report: {sampleReport.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Report Type</div>
                <div className="font-semibold text-gray-800 dark:text-white">{sampleReport.type}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Data Points</div>
                <div className="font-semibold text-gray-800 dark:text-white">{sampleReport.metadata?.dataPoints || 0}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                <div className="font-semibold text-gray-800 dark:text-white">
                  {((sampleReport.metadata?.confidence || 0) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Summary Metrics */}
            {sampleReport.data?.summary && (
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">Summary Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sampleReport.data.summary.primary?.map((metric: MetricItem, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">{metric.label}</div>
                      <div className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                        {metric.value}{metric.unit && ` ${metric.unit}`}
                      </div>
                      {metric.change && (
                        <div className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts */}
            {sampleReport.data?.charts && sampleReport.data.charts.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">Sample Charts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sampleReport.data.charts.map((chart: ChartConfiguration, index: number) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <EnhancedChart config={chart} theme="light" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {sampleReport.data?.recommendations && (
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">AI Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <h5 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Immediate</h5>
                    <div className="space-y-2">
                      {sampleReport.data.recommendations.immediate.map((rec: RecommendationItem, index: number) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-blue-700 dark:text-blue-300">{rec.title}</div>
                          <div className="text-blue-600 dark:text-blue-400 text-xs">{rec.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <h5 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Short Term</h5>
                    <div className="space-y-2">
                      {sampleReport.data.recommendations.shortTerm.map((rec: RecommendationItem, index: number) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-blue-700 dark:text-blue-300">{rec.title}</div>
                          <div className="text-blue-600 dark:text-blue-400 text-xs">{rec.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <h5 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Long Term</h5>
                    <div className="space-y-2">
                      {sampleReport.data.recommendations.longTerm.map((rec: RecommendationItem, index: number) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-blue-700 dark:text-blue-300">{rec.title}</div>
                          <div className="text-blue-600 dark:text-blue-400 text-xs">{rec.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Raw Data Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">Raw Data Preview</h4>
              <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                {JSON.stringify(sampleReport, null, 2).substring(0, 500)}...
              </pre>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}