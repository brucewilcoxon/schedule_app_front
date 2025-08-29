import React from "react";
import { Button } from "../@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../@/components/ui/radio-group";
import { RefrigerantCompany } from "../api/refrigerantCompanyApi";
import { format } from "date-fns";
import { MapPinIcon, CalendarIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  companies: RefrigerantCompany[];
  onEdit: (company: RefrigerantCompany) => void;
  onDelete: (id: number) => void;
  onSelectionChange: (selectedId: number | null) => void;
  selectedId: number | null;
  isLoading?: boolean;
}

const RefrigerantCompanyList: React.FC<Props> = ({
  companies,
  onEdit,
  onDelete,
  onSelectionChange,
  selectedId,
  isLoading = false,
}) => {
  const getProcessTypeColor = (processType: string) => {
    switch (processType) {
      case "collection":
        return "bg-red-100 text-red-800";
      case "filling":
        return "bg-blue-100 text-blue-800";
      case "collection_filling":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProcessTypeLabel = (processType: string) => {
    switch (processType) {
      case "collection":
        return "回収";
      case "filling":
        return "充填";
      case "collection_filling":
        return "回収充填";
      default:
        return processType;
    }
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        データがありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedId?.toString() || ""}
        onValueChange={(value) => onSelectionChange(value ? parseInt(value) : null)}
        className="space-y-4"
      >
        {companies.map((company) => (
          <div
            key={company.id}
            className={`relative bg-white rounded-lg border-2 p-4 transition-all duration-200 ${
              selectedId === company.id
                ? "border-blue-500 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Radio Button */}
            <div className="absolute top-4 left-4">
              <RadioGroupItem
                value={company.id.toString()}
                id={`radio-${company.id}`}
                disabled={isLoading}
                className="w-5 h-5"
              />
            </div>

            {/* Main Content */}
            <div className="ml-8">
              {/* Header Row */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{company.item}</h3>
                  <p className="text-blue-600 font-semibold text-sm">
                    {company.process_type_label}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(company)}
                    disabled={isLoading}
                    className="flex items-center space-x-1"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>編集</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(company.id)}
                    disabled={isLoading}
                    className="flex items-center space-x-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>削除</span>
                  </Button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Owner */}
                {company.owner && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-sm">所有者:</span>
                    <span className="text-gray-900 font-medium">{company.owner}</span>
                  </div>
                )}

                {/* Manager */}
                {company.manager && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-sm">管理者:</span>
                    <span className="text-gray-900 font-medium">{company.manager.name}</span>
                  </div>
                )}

                {/* Residence */}
                {company.residence && (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-red-500" />
                    <span className="text-gray-900 font-medium">{company.residence}</span>
                  </div>
                )}

                {/* Delivery Date */}
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 font-medium">
                    {format(new Date(company.delivery_date), "yyyy-MM-dd")}
                  </span>
                </div>

                {/* Process Type Badge */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getProcessTypeColor(
                      company.process_type
                    )}`}
                  >
                    {getProcessTypeLabel(company.process_type)}
                  </span>
                </div>
              </div>

              {/* Selection Status */}
              {company.is_selected && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ○ 選択済み
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RefrigerantCompanyList; 