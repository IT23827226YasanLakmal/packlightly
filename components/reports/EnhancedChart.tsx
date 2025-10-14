"use client";
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";
import { ChartConfiguration, ChartDataPoint } from "@/types";
import { CHART_COLORS } from "@/utils/reportFormatHelpers";

interface EnhancedChartProps {
  config: ChartConfiguration;
  theme?: 'light' | 'dark';
  className?: string;
}

/**
 * Enhanced Chart Component that renders different chart types based on configuration
 */
export default function EnhancedChart({ config, theme = 'light', className = "" }: EnhancedChartProps) {
  const { type, title, data, options } = config;
  
  // Theme-aware colors
  const colors = theme === 'dark' 
    ? ['#34D399', '#10B981', '#059669', '#047857', '#065F46']
    : options.colors || CHART_COLORS.primary;

  const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';
  const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';

  // Common tooltip styles
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
    borderRadius: '8px',
    color: textColor,
    fontSize: '14px',
    padding: '8px 12px'
  };

  // Convert ChartDataPoint[] to chart-specific format
  const formatDataForChart = (chartData: ChartDataPoint[], chartType: string) => {
    switch (chartType) {
      case 'pie':
      case 'donut':
        return chartData.map(point => ({
          name: point.label,
          value: point.value,
          fill: point.color || colors[chartData.indexOf(point) % colors.length]
        }));
      default:
        return chartData.map(point => ({
          name: point.label,
          value: point.value,
          [point.label]: point.value,
          ...point.metadata
        }));
    }
  };

  const chartData = formatDataForChart(data, type);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData}>
            {options.grid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              dataKey="name" 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData}>
            {options.grid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              dataKey="name" 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
            <Bar 
              dataKey="value" 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'stacked-bar':
        return (
          <BarChart data={chartData}>
            {options.grid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              dataKey="name" 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
            {colors.map((color, index) => (
              <Bar 
                key={index}
                dataKey={`series${index + 1}`} 
                stackId="a"
                fill={color}
                radius={index === colors.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData}>
            {options.grid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              dataKey="name" 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }: { name?: string; percent?: number }) => 
                `${name || 'Unknown'}: ${((percent || 0) * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry: { fill?: string }, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill || colors[index % colors.length]} 
                />
              ))}
            </Pie>
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
          </PieChart>
        );

      case 'donut':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }: { name?: string; percent?: number }) => 
                `${name || 'Unknown'}: ${((percent || 0) * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry: { fill?: string }, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill || colors[index % colors.length]} 
                />
              ))}
            </Pie>
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart data={chartData}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis tick={{ fill: textColor, fontSize: 12 }} />
            <PolarRadiusAxis 
              tick={{ fill: textColor, fontSize: 10 }} 
              domain={[0, 'dataMax']}
            />
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
            <Radar
              name="Values"
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        );

      case 'scatter':
        return (
          <ScatterChart data={chartData}>
            {options.grid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              type="number"
              dataKey="value"
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              type="number"
              dataKey="value"
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
            <Scatter
              data={chartData}
              fill={colors[0]}
            />
          </ScatterChart>
        );

      case 'combo':
      case 'multi-line':
        return (
          <ComposedChart data={chartData}>
            {options.grid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
            <XAxis 
              dataKey="name" 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
            />
            {options.tooltip && <Tooltip contentStyle={tooltipStyle} />}
            {options.legend && <Legend wrapperStyle={{ color: textColor }} />}
            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors[1]} 
              strokeWidth={3}
              dot={{ fill: colors[1], strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Unsupported chart type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h3>
          {config.description && (
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {config.description}
            </p>
          )}
        </div>
      )}
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {config.insights && config.insights.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700">
          <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Key Insights
          </h4>
          <ul className="space-y-1">
            {config.insights.map((insight, index) => (
              <li 
                key={index} 
                className={`text-xs ${theme === 'dark' ? 'text-emerald-200' : 'text-emerald-600'}`}
              >
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Chart Gallery Component for showcasing different chart types
 */
export function ChartGallery({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const sampleData = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 180 },
    { label: 'Apr', value: 160 },
    { label: 'May', value: 200 }
  ];

  const chartConfigs: ChartConfiguration[] = [
    {
      id: 'line-sample',
      type: 'line',
      title: 'Trend Analysis',
      data: sampleData,
      options: {
        responsive: true,
        colors: CHART_COLORS.primary,
        theme,
        animations: true,
        legend: true,
        tooltip: true,
        grid: true
      }
    },
    {
      id: 'bar-sample',
      type: 'bar',
      title: 'Category Comparison',
      data: sampleData,
      options: {
        responsive: true,
        colors: CHART_COLORS.primary,
        theme,
        animations: true,
        legend: false,
        tooltip: true,
        grid: true
      }
    },
    {
      id: 'pie-sample',
      type: 'pie',
      title: 'Distribution Analysis',
      data: sampleData,
      options: {
        responsive: true,
        colors: CHART_COLORS.primary,
        theme,
        animations: true,
        legend: true,
        tooltip: true,
        grid: false
      }
    },
    {
      id: 'radar-sample',
      type: 'radar',
      title: 'Multi-Dimensional View',
      data: sampleData,
      options: {
        responsive: true,
        colors: CHART_COLORS.eco,
        theme,
        animations: true,
        legend: true,
        tooltip: true,
        grid: true
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {chartConfigs.map((config) => (
        <div 
          key={config.id}
          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <EnhancedChart config={config} theme={theme} />
        </div>
      ))}
    </div>
  );
}