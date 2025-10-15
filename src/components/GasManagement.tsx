import React, { useState, useEffect, useCallback } from 'react';
import { GasType, GasFilter, GasApiResponse, GasProcessOption } from '../types/Gas';
import { gasApi } from '../api/gas';
import GasSummary from './GasSummary';
import GasFilters from './GasFilters';
import GasDataList from './GasDataList';
import GasCreateModal from './GasCreateModal';
import GasEditModal from './GasEditModal';
import Layout from './Layout';
import NoteHeader from './NoteHeader';
import RequireAuth from './RequireAuth';

const GasManagement: React.FC = () => {
  const [gasData, setGasData] = useState<GasApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GasFilter>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGas, setEditingGas] = useState<GasType | null>(null);
  const [gasTypes, setGasTypes] = useState<string[]>([]);
  const [prefectures, setPrefectures] = useState<string[]>([]);

  const processOptions: GasProcessOption[] = [
    { value: 'recovery', label: '回収' },
    { value: 'filling', label: '充填' },
    { value: 'refilling', label: '再充填' },
  ];

  const loadGasData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gasApi.getGasData(filters);
      setGasData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gas data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadGasData();
    loadFilterOptions();
  }, [loadGasData]);

  const loadFilterOptions = async () => {
    try {
      const [types, prefs] = await Promise.all([
        gasApi.getGasTypes(),
        gasApi.getPrefectures(),
      ]);
      setGasTypes(types);
      setPrefectures(prefs);
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const handleFilterChange = (newFilters: GasFilter) => {
    setFilters(newFilters);
  };

  const handleCreateGas = async (gasData: Omit<GasType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await gasApi.createGas(gasData);
      setShowCreateModal(false);
      loadGasData();
      loadFilterOptions(); // Refresh filter options
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gas record');
    }
  };

  const handleUpdateGas = async (id: number, gasData: Partial<GasType>) => {
    try {
      await gasApi.updateGas(id, gasData);
      setEditingGas(null);
      loadGasData();
      loadFilterOptions(); // Refresh filter options
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update gas record');
    }
  };

  const handleDeleteGas = async (id: number) => {
    if (window.confirm('このガス記録を削除しますか？')) {
      try {
        await gasApi.deleteGas(id);
        loadGasData();
        loadFilterOptions(); // Refresh filter options
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete gas record');
      }
    }
  };

  const handleExportCSV = () => {
    if (!gasData?.data) return;

    const csvContent = [
      ['日付', 'ガスの種類', '数量', '入庫都道府県', 'ガス処理'].join(','),
      ...gasData.data.map(gas => [
        gas.date,
        gas.gas_type,
        gas.quantity,
        gas.prefecture,
        processOptions.find(opt => opt.value === gas.process)?.label || gas.process
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gas_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <RequireAuth>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">データを読み込み中...</p>
            </div>
          </div>
        </Layout>
      </RequireAuth>
    );
  }

  if (error) {
    return (
      <RequireAuth>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">エラーが発生しました</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadGasData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                再試行
              </button>
            </div>
          </div>
        </Layout>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <Layout>
        <NoteHeader />
        <div className="px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Gas Management System</h1>
            <p className="mt-1 text-sm text-gray-600">ガス管理システム</p>
          </div>

          {/* Summary Section */}
          {gasData?.summary && (
            <GasSummary summary={gasData.summary} />
          )}

          {/* Filters Section */}
          <GasFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            gasTypes={gasTypes}
            prefectures={prefectures}
            processOptions={processOptions}
          />

          {/* Data List Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">ガスデータ一覧</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    CSV Download
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    + Register New
                  </button>
                </div>
              </div>
            </div>

            <GasDataList
              dailyData={gasData?.daily_data || []}
              processOptions={processOptions}
              onEdit={setEditingGas}
              onDelete={handleDeleteGas}
            />
          </div>
        </div>

        {/* Modals */}
        {showCreateModal && (
          <GasCreateModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateGas}
            gasTypes={gasTypes}
            prefectures={prefectures}
            processOptions={processOptions}
          />
        )}

        {editingGas && (
          <GasEditModal
            gas={editingGas}
            onClose={() => setEditingGas(null)}
            onSubmit={handleUpdateGas}
            gasTypes={gasTypes}
            prefectures={prefectures}
            processOptions={processOptions}
          />
        )}
      </Layout>
    </RequireAuth>
  );
};

export default GasManagement;
