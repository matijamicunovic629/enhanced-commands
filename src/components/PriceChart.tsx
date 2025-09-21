import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CoinData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface PriceChartProps {
  data: CoinData;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  if (!data || !data.chartData) {
    return (
      <div className="h-[200px] w-full mt-2 flex items-center justify-center text-white/60">
        No chart data available
      </div>
    );
  }

  const chartData = {
    labels: data.chartData.map(point => 
      new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        fill: true,
        label: 'Price (USD)',
        data: data.chartData.map(point => point.price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
  };

  return (
    <div className="h-[200px] w-full mt-2">
      <div className="flex items-center gap-2 mb-2">
        {data.image && (
          <img 
            src={data.image} 
            alt={data.id} 
            className="w-6 h-6 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/24/4A90E2/FFFFFF?text=${data.id.charAt(0).toUpperCase()}`;
            }}
          />
        )}
        <div className="text-lg font-medium">${data.price.toLocaleString()}</div>
        <div className={`text-sm ${data.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {data.priceChange24h >= 0 ? '+' : ''}{data.priceChange24h.toFixed(2)}%
        </div>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};