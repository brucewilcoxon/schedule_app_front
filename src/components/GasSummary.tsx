import React from 'react';
import { GasSummary as GasSummaryType } from '../types/Gas';

interface GasSummaryProps {
  summary: GasSummaryType;
}

const GasSummary: React.FC<GasSummaryProps> = ({ summary }) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('ja-JP');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">サマリー</h2>
        <span className="text-xs text-gray-500">期間: 今月</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* 回収 (Recovery) */}
        <div className="bg-gray-100 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600 mb-1">回収</div>
          <div className="text-lg font-bold text-gray-900">
            {formatNumber(summary.recovery)} kg
          </div>
        </div>

        {/* 充填 (Filling) */}
        <div className="bg-gray-100 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600 mb-1">充填</div>
          <div className="text-lg font-bold text-gray-900">
            {formatNumber(summary.filling)} kg
          </div>
        </div>

        {/* 再充填 (Refilling) */}
        <div className="bg-gray-100 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600 mb-1">再充填</div>
          <div className="text-lg font-bold text-gray-900">
            {formatNumber(summary.refilling)} kg
          </div>
        </div>

        {/* 合計 (Total) */}
        <div className="bg-blue-100 rounded-lg p-3 text-center">
          <div className="text-xs text-blue-600 mb-1">合計</div>
          <div className="text-lg font-bold text-blue-900">
            {formatNumber(summary.total)} kg
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasSummary;
