import React, { useState } from "react";
import { Dialog, DialogContent } from "../@/components/ui/dialog";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { RefrigerantUsageLog } from "../types/Refrigerant";

interface Props {
  open: boolean;
  onClose: () => void;
  log: RefrigerantUsageLog | null;
}

const CSVDownloadModal: React.FC<Props> = ({ open, onClose, log }) => {
  const [formData, setFormData] = useState({
    owner: "",
    manager: "",
    address: "",
    businessOfficeAddress: "",
    vehicleRegistrationNumber: "",
    model: "",
    serialNumber: "",
    initialFillingAmount: "",
    operatingCompanyName: "",
    operatingCompanyAddress: "",
    registeredPrefecture: "",
    fillingRecoveryTechnician: "",
    phoneNumber: "",
    registrationNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCSVDownload = () => {
    // Create CSV content
    const csvContent = [
      "所有者,管理者,住所,事業所住所,車両登録番号,機種,シリアル番号,初期充填量(Kg),作業会社名,作業会社住所,登録都道府県,充填回収技術者,電話番号,登録番号",
      `${formData.owner},${formData.manager},${formData.address},${formData.businessOfficeAddress},${formData.vehicleRegistrationNumber},${formData.model},${formData.serialNumber},${formData.initialFillingAmount},${formData.operatingCompanyName},${formData.operatingCompanyAddress},${formData.registeredPrefecture},${formData.fillingRecoveryTechnician},${formData.phoneNumber},${formData.registrationNumber}`
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `refrigerant_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">CSVダウンロード用データ入力</h1>
        </div>
        
        <div className="space-y-6">
          {/* 所有者・管理者・住所 Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">基本情報</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">所有者</label>
                <Input
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  placeholder="所有者を入力してください"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">管理者</label>
                <Input
                  value={formData.manager}
                  onChange={(e) => handleInputChange('manager', e.target.value)}
                  placeholder="管理者を入力してください"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">住所</label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="住所を入力してください"
                />
              </div>
            </div>
          </div>

          {/* 事業所 Section */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-4">事業所(使用先)</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">住所</label>
                <Input
                  value={formData.businessOfficeAddress}
                  onChange={(e) => handleInputChange('businessOfficeAddress', e.target.value)}
                  placeholder="事業所住所を入力してください"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">車両登録番号</label>
                  <Input
                    value={formData.vehicleRegistrationNumber}
                    onChange={(e) => handleInputChange('vehicleRegistrationNumber', e.target.value)}
                    placeholder="車両登録番号を入力してください"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">シリアル番号</label>
                  <Input
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    placeholder="シリアル番号を入力してください"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">機種</label>
                  <Input
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="機種を入力してください"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">初期充填量 (Kg)</label>
                  <Input
                    value={formData.initialFillingAmount}
                    onChange={(e) => handleInputChange('initialFillingAmount', e.target.value)}
                    placeholder="初期充填量を入力してください"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 作業会社 Section */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">作業会社情報</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">作業会社名</label>
                <Input
                  value={formData.operatingCompanyName}
                  onChange={(e) => handleInputChange('operatingCompanyName', e.target.value)}
                  placeholder="作業会社名を入力してください"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">住所</label>
                  <Input
                    value={formData.operatingCompanyAddress}
                    onChange={(e) => handleInputChange('operatingCompanyAddress', e.target.value)}
                    placeholder="作業会社住所を入力してください"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">充填回収技術者</label>
                  <Input
                    value={formData.fillingRecoveryTechnician}
                    onChange={(e) => handleInputChange('fillingRecoveryTechnician', e.target.value)}
                    placeholder="充填回収技術者を入力してください"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">登録都道府県</label>
                  <Input
                    value={formData.registeredPrefecture}
                    onChange={(e) => handleInputChange('registeredPrefecture', e.target.value)}
                    placeholder="登録都道府県を入力してください"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">電話番号</label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="電話番号を入力してください"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">登録番号</label>
                <Input
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="登録番号を入力してください"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleCSVDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            CSVダウンロード
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVDownloadModal; 