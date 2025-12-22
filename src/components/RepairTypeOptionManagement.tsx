import React, { useState } from "react";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../@/components/ui/alert-dialog";
import {
  useGetRepairTypeOptions,
  useCreateRepairTypeOption,
  useDeleteRepairTypeOption,
} from "../queries/RepairTypeOptionQuery";
import NoteHeader from "./NoteHeader";
import Layout from "./Layout";
import RequireAuth from "./RequireAuth";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const RepairTypeOptionManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  const [optionToDelete, setOptionToDelete] = useState<number | null>(null);

  const { data: options = [], isLoading } = useGetRepairTypeOptions();
  const createMutation = useCreateRepairTypeOption();
  const deleteMutation = useDeleteRepairTypeOption();

  const handleCreate = async () => {
    if (!newOptionName.trim()) {
      return;
    }

    try {
      await createMutation.mutateAsync({ name: newOptionName.trim() });
      setNewOptionName("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteClick = (id: number) => {
    setOptionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (optionToDelete) {
      try {
        await deleteMutation.mutateAsync(optionToDelete);
        setIsDeleteDialogOpen(false);
        setOptionToDelete(null);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  修理の種類管理
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  修理の種類を追加・削除できます
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <AddIcon className="mr-2" />
                    追加
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新しい修理の種類を追加</DialogTitle>
                    <DialogDescription>
                      修理の種類の名前を入力してください
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
                      placeholder="例: 冷却不良"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleCreate();
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      現在: {options.length}個
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={!newOptionName.trim() || createMutation.isLoading}
                    >
                      {createMutation.isLoading ? "追加中..." : "追加"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                読み込み中...
              </div>
            ) : options.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                修理の種類が登録されていません
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {option.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(option.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>削除の確認</AlertDialogTitle>
                  <AlertDialogDescription>
                    この修理の種類を削除してもよろしいですか？
                    この操作は取り消せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    削除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </RequireAuth>
    </Layout>
  );
};

export default RepairTypeOptionManagement;

