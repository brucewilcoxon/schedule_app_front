import React from "react";
import { Button } from "../@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../@/components/ui/radio-group";
import { RefrigerantWorkplace } from "../api/refrigerantWorkplaceApi";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface Props {
  items: RefrigerantWorkplace[];
  onEdit: (item: RefrigerantWorkplace) => void;
  onDelete: (id: number) => void;
  onSelectionChange: (id: number | null) => void;
  selectedId: number | null;
  isLoading?: boolean;
}

const RefrigerantWorkplaceList: React.FC<Props> = ({ items, onEdit, onDelete, onSelectionChange, selectedId, isLoading = false }) => {
  if (items.length === 0) {
    return <div className="text-center py-8 text-gray-500">データがありません</div>;
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedId?.toString() || ""} onValueChange={(v) => onSelectionChange(v ? parseInt(v) : null)} className="space-y-4">
        {items.map((w) => (
          <div key={w.id} className={`relative bg-white rounded-lg border-2 p-4 transition-all duration-200 ${selectedId === w.id ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"}`}>
            <div className="absolute top-4 left-4">
              <RadioGroupItem value={w.id.toString()} id={`radio-${w.id}`} disabled={isLoading} className="w-5 h-5" />
            </div>
            <div className="ml-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{w.business}</h3>
                  {w.gas_type && <p className="text-blue-600 font-semibold text-sm">{w.gas_type}</p>}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(w)} disabled={isLoading}>編集</Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(w.id)} disabled={isLoading}>削除</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {w.residence && (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-red-500" />
                    <span className="text-gray-900">{w.residence}</span>
                  </div>
                )}
                {w.vehicle_registration_number && (
                  <div><span className="text-gray-600">車両登録番号:</span> <span className="text-gray-900 font-medium">{w.vehicle_registration_number}</span></div>
                )}
                {w.serial_number && (
                  <div><span className="text-gray-600">シリアル番号:</span> <span className="text-gray-900 font-medium">{w.serial_number}</span></div>
                )}
                {w.machine_type && (
                  <div><span className="text-gray-600">機種:</span> <span className="text-gray-900 font-medium">{w.machine_type}</span></div>
                )}
                {w.initial_fill_amount !== undefined && w.initial_fill_amount !== null && (
                  <div><span className="text-gray-600">初期充填量:</span> <span className="text-gray-900 font-medium">{w.initial_fill_amount} kg</span></div>
                )}
              </div>

              {w.is_selected && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">○ 選択済み</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RefrigerantWorkplaceList; 