import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button } from "../@/components/ui/button";
import RefrigerantCompanyModal from "../components/RefrigerantCompanyModal";
import RefrigerantCompanyList from "../components/RefrigerantCompanyList";
import {
  getRefrigerantCompanies,
  createRefrigerantCompany,
  updateRefrigerantCompany,
  deleteRefrigerantCompany,
  RefrigerantCompany,
  CreateRefrigerantCompanyData,
} from "../api/refrigerantCompanyApi";

const RefrigerantCompanyPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<RefrigerantCompany | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading, error } = useQuery(
    "refrigerant-companies",
    getRefrigerantCompanies
  );

  const createMutation = useMutation(createRefrigerantCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries("refrigerant-companies");
      toast.success("冷媒会社が作成されました");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("冷媒会社の作成に失敗しました");
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: CreateRefrigerantCompanyData }) =>
      updateRefrigerantCompany(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("refrigerant-companies");
        toast.success("冷媒会社が更新されました");
        setIsModalOpen(false);
        setEditingCompany(null);
      },
      onError: () => {
        toast.error("冷媒会社の更新に失敗しました");
      },
    }
  );

  const deleteMutation = useMutation(deleteRefrigerantCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries("refrigerant-companies");
      toast.success("冷媒会社が削除されました");
      setSelectedId(null);
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      if (error.response?.status === 404) {
        toast.error("冷媒会社が見つかりません");
      } else if (error.response?.status === 403) {
        toast.error("削除する権限がありません");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("冷媒会社の削除に失敗しました");
      }
    },
  });

  const handleSubmit = (data: CreateRefrigerantCompanyData) => {
    if (editingCompany) {
      updateMutation.mutate({ id: editingCompany.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (company: RefrigerantCompany) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("この冷媒会社を削除しますか？")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSelectionChange = (selectedId: number | null) => {
    setSelectedId(selectedId);
  };

  const handleCollect = () => {
    if (selectedId) {
      const selectedCompany = companies.find(c => c.id === selectedId);
      if (selectedCompany) {
        toast.success(`${selectedCompany.item} を回収しました`);
        // Here you can add additional logic for collection
      }
    } else {
      toast.warning("回収する項目を選択してください");
    }
  };

  const handleOpenModal = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">エラーが発生しました</div>
          <div className="text-gray-600">データの読み込みに失敗しました</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">冷媒会社管理</h1>
              <p className="text-gray-600 mt-1">
                冷媒会社の情報を管理し、回収・充填プロセスを追跡します
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleCollect}
                disabled={!selectedId || isLoading}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                回収する
              </Button>
              <Button 
                onClick={handleOpenModal} 
                disabled={isLoading}
                variant="outline"
              >
                新規追加
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">読み込み中...</span>
            </div>
          ) : (
            <RefrigerantCompanyList
              companies={companies}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelectionChange={handleSelectionChange}
              selectedId={selectedId}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      <RefrigerantCompanyModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        company={editingCompany}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </div>
  );
};

export default RefrigerantCompanyPage; 