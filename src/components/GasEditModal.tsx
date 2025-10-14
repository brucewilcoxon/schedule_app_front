import React, { useState, useEffect } from 'react';
import { GasType, GasProcessOption } from '../types/Gas';

interface GasEditModalProps {
  gas: GasType;
  onClose: () => void;
  onSubmit: (id: number, gasData: Partial<GasType>) => void;
  gasTypes: string[];
  prefectures: string[];
  processOptions: GasProcessOption[];
}

const GasEditModal: React.FC<GasEditModalProps> = ({
  gas,
  onClose,
  onSubmit,
  gasTypes,
  prefectures,
  processOptions,
}) => {
  // Master lists
  const gasTypeOptions = ["R-4", "R-5", "R-6"];
  const prefectureOptions = [
    "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
    "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
    "新潟県","富山県","石川県","福井県","山梨県","長野県",
    "岐阜県","静岡県","愛知県","三重県",
    "滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
    "鳥取県","島根県","岡山県","広島県","山口県",
    "徳島県","香川県","愛媛県","高知県",
    "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"
  ];
  // Normalize API date (e.g. 2025-10-14T00:00:00.000000Z) to YYYY-MM-DD for <input type="date" />
  const normalizeDateForInput = (value: string) => {
    if (!value) return "";
    // Already in YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    // ISO string
    const iso = value.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    try {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
    } catch {}
    return "";
  };

  const [formData, setFormData] = useState({
    gas_type: gas.gas_type,
    quantity: gas.quantity.toString(),
    date: normalizeDateForInput(gas.date as unknown as string),
    prefecture: gas.prefecture,
    process: gas.process,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      gas_type: gas.gas_type,
      quantity: gas.quantity.toString(),
      date: normalizeDateForInput(gas.date as unknown as string),
      prefecture: gas.prefecture,
      process: gas.process,
    });
  }, [gas]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.gas_type.trim()) {
      newErrors.gas_type = 'ガスの種類は必須です';
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = '数量は0より大きい値を入力してください';
    }
    if (!formData.date) {
      newErrors.date = '日付は必須です';
    }
    if (!formData.prefecture.trim()) {
      newErrors.prefecture = '入庫都道府県は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(gas.id!, {
      gas_type: formData.gas_type,
      quantity: parseFloat(formData.quantity),
      date: formData.date,
      prefecture: formData.prefecture,
      process: formData.process,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">ガス記録を編集</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            {/* Gas Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ガスの種類 *
              </label>
              <select
                value={formData.gas_type}
                onChange={(e) => handleInputChange('gas_type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.gas_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">選択してください</option>
                {gasTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.gas_type && (
                <p className="mt-1 text-sm text-red-600">{errors.gas_type}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                数量 (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日付 *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Prefecture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                入庫都道府県 *
              </label>
              <select
                value={formData.prefecture}
                onChange={(e) => handleInputChange('prefecture', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.prefecture ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">選択してください</option>
                {prefectureOptions.map((prefecture) => (
                  <option key={prefecture} value={prefecture}>{prefecture}</option>
                ))}
              </select>
              {errors.prefecture && (
                <p className="mt-1 text-sm text-red-600">{errors.prefecture}</p>
              )}
            </div>

            {/* Process */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ガス処理 *
              </label>
              <select
                value={formData.process}
                onChange={(e) => handleInputChange('process', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {processOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GasEditModal;
