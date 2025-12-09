import React from 'react';
import { Icon } from '@iconify/react';

interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
}

const DataTable: React.FC<DataTableProps> = ({ headers, rows }) => {
  return (
    <div className="bg-white  overflow-hidden border border-gray-200">
      <table className="w-full">
        <thead className="bg-white border-b border-gray-border ">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-dmSans">
                {header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-dmSans">
              Options
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-dmSans">
                  {cell}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                <button className="text-green-600 hover:text-green-900 p-1 rounded">
                  <Icon icon="heroicons:arrow-down-tray-20-solid" className="w-4 h-4" />
                </button>
                <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                  <Icon icon="heroicons:pencil-20-solid" className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1 rounded">
                  <Icon icon="heroicons:trash-20-solid" className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
