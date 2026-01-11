import React, { useState } from 'react';

interface CreateNewDataTableProps {
  title?: string;
  initialRowCount?: number;
  onCreateTable?: (rowCount: number) => void;
  className?: string;
}

const CreateNewDataTableComponent: React.FC<CreateNewDataTableProps> = ({
  title = 'Create New Data Table',
  initialRowCount = 5,
  onCreateTable,
  className,
}) => {
  const [rowCount, setRowCount] = useState(initialRowCount);

  const handleCreateTable = () => {
    if (onCreateTable) {
      onCreateTable(rowCount);
    }
  };

  const handleRowCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowCount(Number(event.target.value));
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex items-center mb-4">
        <label htmlFor="row-count" className="mr-2">
          Number of Rows:
        </label>
        <input
          type="number"
          id="row-count"
          value={rowCount}
          onChange={handleRowCountChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleCreateTable}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create Table
      </button>
    </div>
  );
};

export default CreateNewDataTableComponent;