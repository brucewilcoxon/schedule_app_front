import React, { useState } from "react";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { Label } from "../@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser } from "../queries/UserQuery";
import { User } from "../types/user";
import { toast } from "react-toastify";
import NoteHeader from "./NoteHeader";
import Layout from "./Layout";
import RequireManager from "./RequireManager";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface UserFormData {
  email: string;
  password: string;
  name: string;
  gender: string;
  age: string;
  introduction?: string;
  role: string; // Add this
}

const UserManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    name: "",
    gender: "",
    age: "",
    introduction: "",
    role: "", // Add this
  });

  const { data: users, isLoading } = useGetUsers();
  
  // Debug logging
  console.log('UserManagement render:', { users, isLoading, usersLength: users?.length });
  
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = () => {
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setFormData({
          email: "",
          password: "",
          name: "",
          gender: "",
          age: "",
          introduction: "",
          role: "", // Add this
        });
        toast.success("ユーザーを作成しました");
      },
      onError: () => {
        toast.error("ユーザーの作成に失敗しました");
      },
    });
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      updateUserMutation.mutate(
        { id: selectedUser.id, ...formData },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            setSelectedUser(null);
            setFormData({
              email: "",
              password: "",
              name: "",
              gender: "",
              age: "",
              introduction: "",
              role: "", // Add this
            });
            toast.success("ユーザーを更新しました");
          },
          onError: () => {
            toast.error("ユーザーの更新に失敗しました");
          },
        }
      );
    }
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Attempting to delete user with ID:', userId);
    deleteUserMutation.mutate(userId, {
      onSuccess: (data) => {
        console.log('Delete success:', data);
        toast.success("ユーザーを削除しました");
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      },
      onError: (error) => {
        console.error('Delete error:', error);
        
        // Type guard to check if error has response property (Axios error)
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          console.error('Error response:', axiosError.response);
          console.error('Error status:', axiosError.response?.status);
          console.error('Error data:', axiosError.response?.data);
          
          // Show more specific error message
          const errorMessage = axiosError.response?.data?.message || "ユーザーの削除に失敗しました";
          toast.error(errorMessage);
        } else {
          console.error('Unknown error type:', error);
          toast.error("ユーザーの削除に失敗しました");
        }
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      },
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "",
      name: user.user_profile?.name || "",
      gender: user.user_profile?.gender || "",
      age: user.user_profile?.age || "",
      introduction: user.user_profile?.introduction || "",
      role: user.role || "", // Add this
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <RequireManager>
          <NoteHeader />
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">読み込み中...</div>
          </div>
        </RequireManager>
      </Layout>
    );
  }

  return (
    <Layout>
      <RequireManager>
        <NoteHeader />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ユーザー管理</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <AddIcon className="h-4 w-4" />
                  新規ユーザー作成
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>新規ユーザー作成</DialogTitle>
                  <DialogDescription>
                    新しいユーザーアカウントを作成します。
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      メールアドレス
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      パスワード
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      名前
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">
                      性別
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="性別を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男性</SelectItem>
                        <SelectItem value="female">女性</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="age" className="text-right">
                      年齢
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="introduction" className="text-right">
                      自己紹介
                    </Label>
                    <Input
                      id="introduction"
                      value={formData.introduction}
                      onChange={(e) =>
                        setFormData({ ...formData, introduction: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      役割
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="役割を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worker">作業員</SelectItem>
                        <SelectItem value="manager">管理者</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateUser}>作成</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>メールアドレス</TableHead>
                  <TableHead>名前</TableHead>
                  <TableHead>性別</TableHead>
                  <TableHead>年齢</TableHead>
                  <TableHead>役割</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!users ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      読み込み中...
                    </TableCell>
                  </TableRow>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.user_profile?.name || "-"}</TableCell>
                      <TableCell>
                        {user.user_profile?.gender === "male"
                          ? "男性"
                          : user.user_profile?.gender === "female"
                            ? "女性"
                            : "-"}
                      </TableCell>
                      <TableCell>{user.user_profile?.age || "-"}</TableCell>
                      <TableCell>{user.role || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewDialog(user)}
                          >
                            <VisibilityIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(user)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      ユーザーが見つかりません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>ユーザー編集</DialogTitle>
                <DialogDescription>
                  ユーザー情報を編集します。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    メールアドレス
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-password" className="text-right">
                    パスワード
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="変更する場合のみ入力"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    名前
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-gender" className="text-right">
                    性別
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="性別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男性</SelectItem>
                      <SelectItem value="female">女性</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-age" className="text-right">
                    年齢
                  </Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    役割
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="役割を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">作業員</SelectItem>
                      <SelectItem value="manager">管理者</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-introduction" className="text-right">
                    自己紹介
                  </Label>
                  <Input
                    id="edit-introduction"
                    value={formData.introduction}
                    onChange={(e) =>
                      setFormData({ ...formData, introduction: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateUser}>更新</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>ユーザー詳細</DialogTitle>
                <DialogDescription>
                  ユーザーの詳細情報を表示します。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">ID:</Label>
                  <div className="col-span-3">{selectedUser?.id}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">メールアドレス:</Label>
                  <div className="col-span-3">{selectedUser?.email}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">名前:</Label>
                  <div className="col-span-3">
                    {selectedUser?.user_profile?.name || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">性別:</Label>
                  <div className="col-span-3">
                    {selectedUser?.user_profile?.gender === "male"
                      ? "男性"
                      : selectedUser?.user_profile?.gender === "female"
                        ? "女性"
                        : selectedUser?.user_profile?.gender === "other"
                          ? "その他"
                          : "-"}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">年齢:</Label>
                  <div className="col-span-3">
                    {selectedUser?.user_profile?.age || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-semibold">自己紹介:</Label>
                  <div className="col-span-3">
                    {selectedUser?.user_profile?.introduction || "-"}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>閉じる</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>ユーザーを削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  {userToDelete && (
                    <>
                      この操作は取り消せません。ユーザー「{userToDelete.user_profile?.name || userToDelete.email}」を完全に削除します。
                      <br />
                      <strong>削除されるデータ:</strong>
                      <ul className="mt-2 ml-4 list-disc">
                        <li>ユーザーアカウント</li>
                        <li>プロフィール情報</li>
                        <li>質問・回答</li>
                        <li>カレンダーイベント</li>
                        <li>出艇記録</li>
                        <li>その他の関連データ</li>
                      </ul>
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setUserToDelete(null);
                }}>
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteUserMutation.isLoading}
                >
                  {deleteUserMutation.isLoading ? "削除中..." : "削除する"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </RequireManager>
    </Layout>
  );
};

export default UserManagement; 
