import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button } from "../@/components/ui/button";
import RefrigerantWorkplaceModal from "../components/RefrigerantWorkplaceModal";
import RefrigerantWorkplaceList from "../components/RefrigerantWorkplaceList";
import {
  getRefrigerantWorkplaces,
  createRefrigerantWorkplace,
  updateRefrigerantWorkplace,
  deleteRefrigerantWorkplace,
  RefrigerantWorkplace,
  CreateRefrigerantWorkplaceData,
} from "../api/refrigerantWorkplaceApi";

const RefrigerantWorkplacePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RefrigerantWorkplace | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery("refrigerant-workplaces", getRefrigerantWorkplaces);

  const createMutation = useMutation<RefrigerantWorkplace, unknown, CreateRefrigerantWorkplaceData>(
    createRefrigerantWorkplace,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("refrigerant-workplaces");
        toast.success("事業所が作成されました");
        setIsModalOpen(false);
      },
      onError: () => {
        toast.error("事業所の作成に失敗しました");
      },
    }
  );

  const updateMutation = useMutation<
    RefrigerantWorkplace,
    unknown,
    { id: number; data: CreateRefrigerantWorkplaceData }
  >(
    ({ id, data }) => updateRefrigerantWorkplace(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("refrigerant-workplaces");
        toast.success("事業所が更新されました");
        setIsModalOpen(false);
        setEditing(null);
      },
      onError: () => {
        toast.error("事業所の更新に失敗しました");
      },
    }
  );

  const deleteMutation = useMutation<void, unknown, number>(
    deleteRefrigerantWorkplace,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("refrigerant-workplaces");
        toast.success("事業所が削除されました");
        setSelectedId(null);
      },
      onError: () => {
        toast.error("事業所の削除に失敗しました");
      },
    }
  );

  const handleSubmit = (data: CreateRefrigerantWorkplaceData) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data);
  };

  const handleEdit = (item: RefrigerantWorkplace) => {
    setEditing(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("この事業所を削除しますか？")) deleteMutation.mutate(id);
  };

  const handleOpenModal = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  if (error) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">読み込みに失敗しました</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">事業所管理</h1>
              <p className="text-gray-600 mt-1">事業所（使用先）と設備情報を管理します</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleOpenModal} disabled={isLoading} variant="outline">
                新規追加
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">読み込み中...</span>
            </div>
          ) : (
            <RefrigerantWorkplaceList
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelectionChange={setSelectedId}
              selectedId={selectedId}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      <RefrigerantWorkplaceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </div>
  );
};

export default RefrigerantWorkplacePage; 