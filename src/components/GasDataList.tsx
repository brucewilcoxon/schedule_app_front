import React, { useState } from 'react';
import { GasType, GasProcessOption } from '../types/Gas';
import dayjs from 'dayjs';

interface GasDataListProps {
  dailyData: Array<{
    date: string;
    total: number;
    items: GasType[];
  }>;
  processOptions: GasProcessOption[];
  onEdit: (gas: GasType) => void;
  onDelete: (id: number) => void;
}

const GasDataList: React.FC<GasDataListProps> = ({
  dailyData,
  processOptions,
  onEdit,
  onDelete,
}) => {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ja-JP');
  };

  const getProcessLabel = (process: string) => {
    return processOptions.find(opt => opt.value === process)?.label || process;
  };

  if (dailyData.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        データが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {dailyData.map((dayData) => {
        const isExpanded = expandedDates.has(dayData.date);
        
        return (
          <div key={dayData.date} className="p-4">
            {/* Date Header */}
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => toggleDateExpansion(dayData.date)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <div className="text-base font-semibold text-gray-900">
                  DATE: {dayjs(dayData.date).format('YYYY/MM/DD')}
                </div>
                <div className="text-xs text-gray-500">
                  (Daily Total: {formatNumber(dayData.total)} kg)
                </div>
              </div>
              <div className="text-gray-400">
                {isExpanded ? '▼' : '▲'}
              </div>
            </div>

            {/* Data Table */}
            {isExpanded && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GAS TYPE
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        QUANTITY
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PREFECTURE
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PROCESS
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dayData.items.map((gas) => (
                      <tr key={gas.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                          {gas.gas_type}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                          {formatNumber(gas.quantity)} kg
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                          {gas.prefecture}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                          {getProcessLabel(gas.process)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs font-medium">
                          <div className="flex flex-col sm:flex-row gap-1">
                            <button
                              onClick={() => onEdit(gas)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => gas.id && onDelete(gas.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GasDataList;
