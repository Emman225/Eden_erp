import React from 'react';

interface PieChartProps {
  data: { name: string; value: number; color: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Données indisponibles</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="h-64 flex items-center justify-center md:justify-start space-x-8 mt-4">
      <div className="relative w-40 h-40">
        <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
          {data.map((item, index) => {
            const percent = item.value / total;
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            cumulativePercent += percent;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = percent > 0.5 ? 1 : 0;
            
            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ');

            return <path key={item.name} d={pathData} className={`fill-current ${item.color} hover:opacity-80 transition-opacity cursor-pointer`} />;
          })}
        </svg>
      </div>
      <div className="space-y-3">
        {data.map(item => (
          <div key={item.name} className="flex items-center text-sm">
            <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${item.color.replace('text-', 'bg-')}`}></span>
            <div>
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="ml-2 text-gray-500">{formatCurrency(item.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;