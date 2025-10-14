import React from 'react';
import { GasFilter, GasProcessOption } from '../types/Gas';

interface GasFiltersProps {
  filters: GasFilter;
  onFilterChange: (filters: GasFilter) => void;
  gasTypes: string[];
  prefectures: string[];
  processOptions: GasProcessOption[];
}

const GasFilters: React.FC<GasFiltersProps> = ({
  filters,
  onFilterChange,
  gasTypes,
  prefectures,
  processOptions,
}) => {
  const handleInputChange = (field: keyof GasFilter, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const handleSearch = () => {
    // The search is automatically triggered when filters change
    // This is just for UI consistency
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">検索・フィルター</h3>
      
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            開始日
          </label>
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            終了日
          </label>
          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Gas Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ガスの種類
          </label>
          <select
            value={filters.gas_type || 'all'}
            onChange={(e) => handleInputChange('gas_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            {gasTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Prefecture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            入庫都道府県
          </label>
          <select
            value={filters.prefecture || 'all'}
            onChange={(e) => handleInputChange('prefecture', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            {prefectures.map((prefecture) => (
              <option key={prefecture} value={prefecture}>
                {prefecture}
              </option>
            ))}
          </select>
        </div>

        {/* Process */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ガス処理
          </label>
          <select
            value={filters.process || 'all'}
            onChange={(e) => handleInputChange('process', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            {processOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Search
        </button>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default GasFilters;
