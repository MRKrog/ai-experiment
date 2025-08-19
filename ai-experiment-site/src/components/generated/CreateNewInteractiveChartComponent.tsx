import React, { useState } from 'react';

interface CreateNewInteractiveChartProps {
  initialData?: number[];
  title?: string;
  onDataChange?: (data: number[]) => void;
}

const CreateNewInteractiveChartComponent: React.FC<CreateNewInteractiveChartProps> = ({
  initialData = [0, 0, 0, 0, 0],
  title = 'New Interactive Chart',
  onDataChange,
}) => {
  const [chartData, setChartData] = useState<number[]>(initialData);

  const handleDataChange = (index: number, value: number) => {
    const newData = [...chartData];
    newData[index] = value;
    setChartData(newData);
    onDataChange?.(newData);
  };

  return (
    <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {chartData.map((value, index) => (
          <div
            key={index}
            className="relative rounded-lg bg-gray-800 bg-opacity-50 hover:bg-opacity-75 transition-all duration-300 cursor-pointer"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={() => handleDataChange(index, value + 1)}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 opacity-30 blur-xl"></div>
            <div className="relative z-10 flex items-center justify-center h-24 text-white font-bold text-4xl">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateNewInteractiveChartComponent;