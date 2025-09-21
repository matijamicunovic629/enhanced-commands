import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  width = 120,
  height = 40,
  color = '#3B82F6'
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false }
      },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: { 
        vertLine: { visible: false },
        horzLine: { visible: false }
      },
      handleScroll: false,
      handleScale: false
    });

    // Add area series
    const areaSeries = chart.addAreaSeries({
      lineColor: color,
      topColor: `${color}20`,
      bottomColor: 'transparent',
      lineWidth: 1,
      priceLineVisible: false,
      crosshairMarkerVisible: false
    });

    // Format data for the chart
    const chartData = data.map((price, index) => ({
      time: index,
      value: price
    }));

    areaSeries.setData(chartData);

    // Fit content
    chart.timeScale().fitContent();

    // Store reference
    chartRef.current = chart;

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, width, height, color]);

  return <div ref={chartContainerRef} />;
};