import React from 'react';

interface BarChartProps {
  data: { name: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartHeight = 200;
  const barWidth = 35;
  const barMargin = 20;
  const chartPadding = 30;
  const maxValue = Math.max(...data.map(d => d.value), 0) * 1.1; // 10% padding at top

  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Données indisponibles</p>
      </div>
    );
  }

  const chartWidth = data.length * (barWidth + barMargin);

  return (
    <div className="h-64 w-full mt-4">
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight + chartPadding}`}>
        {/* Y-axis Lines */}
        {[0.25, 0.5, 0.75, 1].map(multiple => (
            <line
                key={multiple}
                x1="0"
                y1={chartHeight - (chartHeight * multiple)}
                x2={chartWidth}
                y2={chartHeight - (chartHeight * multiple)}
                className="stroke-current text-gray-200"
                strokeWidth="1"
                strokeDasharray="2,2"
            />
        ))}
        
        {/* Bars and Labels */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = index * (barWidth + barMargin) + barMargin / 2;
          
          return (
            <g key={item.name} className="group">
              <rect
                x={x}
                y={chartHeight - barHeight}
                width={barWidth}
                height={barHeight}
                className="fill-current text-blue-400 group-hover:text-blue-500 transition-colors"
                rx="3"
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight - barHeight - 5}
                textAnchor="middle"
                className="text-xs fill-current text-gray-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {item.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartHeight + 18}
                textAnchor="middle"
                className="text-xs fill-current text-gray-600 font-medium"
              >
                {item.name}
              </text>
            </g>
          );
        })}
        {/* X-axis line */}
        <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="currentColor" className="text-gray-300" strokeWidth="1"/>
      </svg>
    </div>
  );
};

export default BarChart;