import React, { useState, useCallback } from "react";
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
  passwordConfirm: string;
  name: string;
  gender: string;
  age: string;
  introduction?: string;
  role: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  role?: string;
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
    passwordConfirm: "",
    name: "",
    gender: "",
    age: "",
    introduction: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { data: users, isLoading } = useGetUsers();
  
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Form validation
  const validateForm = useCallback((data: UserFormData, isEdit = false): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.email.trim()) {
      errors.email = "メールアドレスは必須です";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "有効なメールアドレスを入力してください";
    }
    
    // For create: password is required
    // For edit: password is optional, but if provided, must be at least 6 characters
    if (!isEdit && !data.password.trim()) {
      errors.password = "パスワードは必須です";
    } else if (data.password && data.password.trim() !== '' && data.password.length < 6) {
      errors.password = "パスワードは6文字以上で入力してください";
    }
    
    // Password confirmation validation
    if (!isEdit) {
      // For create: password confirmation is required
      if (!data.passwordConfirm.trim()) {
        errors.passwordConfirm = "パスワード確認は必須です";
      } else if (data.password !== data.passwordConfirm) {
        errors.passwordConfirm = "パスワードが一致しません";
      }
    } else {
      // For edit: password confirmation is required only if password is provided
      if (data.password && data.password.trim() !== '') {
        if (!data.passwordConfirm.trim()) {
          errors.passwordConfirm = "パスワード確認は必須です";
        } else if (data.password !== data.passwordConfirm) {
          errors.passwordConfirm = "パスワードが一致しません";
        }
      }
    }
    
    if (!data.name.trim()) {
      errors.name = "名前は必須です";
    }
    
    if (!data.role) {
      errors.role = "役割は必須です";
    }
    
    return errors;
  }, []);

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData({
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      gender: "",
      age: "",
      introduction: "",
      role: "",
    });
    setFormErrors({});
  }, []);

  const handleCreateUser = useCallback(() => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        resetFormData();
        toast.success("ユーザーを作成しました");
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "ユーザーの作成に失敗しました";
        toast.error(errorMessage);
      },
    });
  }, [formData, validateForm, createUserMutation, resetFormData]);

  const handleUpdateUser = useCallback(() => {
    if (!selectedUser) return;
    
    const errors = validateForm(formData, true);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    
    // Prepare update data - only include password if it's not empty
    const updateData = {
      id: selectedUser.id,
      email: formData.email,
      name: formData.name,
      gender: formData.gender,
      age: formData.age,
      introduction: formData.introduction,
      role: formData.role,
      ...(formData.password && formData.password.trim() !== '' && { password: formData.password })
    };
    
    updateUserMutation.mutate(
      updateData,
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
          resetFormData();
          toast.success("ユーザーを更新しました");
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "ユーザーの更新に失敗しました";
          toast.error(errorMessage);
        },
      }
    );
  }, [selectedUser, formData, validateForm, updateUserMutation, resetFormData]);

  const handleDeleteUser = useCallback((userId: number) => {
    deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        toast.success("ユーザーを削除しました");
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "ユーザーの削除に失敗しました";
        toast.error(errorMessage);
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      },
    });
  }, [deleteUserMutation]);

  const openEditDialog = useCallback((user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "",
      passwordConfirm: "",
      name: user.user_profile?.name || "",
      gender: user.user_profile?.gender || "",
      age: user.user_profile?.age || "",
      introduction: user.user_profile?.introduction || "",
      role: user.role || "",
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  }, []);

  const openViewDialog = useCallback((user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id);
    }
  }, [userToDelete, handleDeleteUser]);

  // Memoized role display
  const getRoleDisplay = useCallback((role: string) => {
    switch (role) {
      case 'manager':
        return '管理者';
      case 'worker':
        return '作業員';
      default:
        return '-';
    }
  }, []);

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
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (open) {
                resetFormData();
              } else {
                // Reset form when dialog is closed
                resetFormData();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <AddIcon className="h-4 w-4" />
                  新規ユーザー作成
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>新規ユーザー作成</DialogTitle>
                  <DialogDescription>
                    新しいユーザーアカウントを作成します。
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      メールアドレス <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) {
                          setFormErrors({ ...formErrors, email: undefined });
                        }
                      }}
                      className={formErrors.email ? "border-red-500" : ""}
                      aria-describedby={formErrors.email ? "email-error" : undefined}
                    />
                    {formErrors.email && (
                      <p id="email-error" className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      パスワード <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (formErrors.password) {
                          setFormErrors({ ...formErrors, password: undefined });
                        }
                        // Clear password confirm error when password changes
                        if (formErrors.passwordConfirm) {
                          setFormErrors({ ...formErrors, passwordConfirm: undefined });
                        }
                      }}
                      className={formErrors.password ? "border-red-500" : ""}
                      aria-describedby={formErrors.password ? "password-error" : undefined}
                    />
                    {formErrors.password && (
                      <p id="password-error" className="text-red-500 text-sm mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirm" className="text-sm font-medium">
                      パスワード確認 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="passwordConfirm"
                      type="password"
                      value={formData.passwordConfirm}
                      onChange={(e) => {
                        setFormData({ ...formData, passwordConfirm: e.target.value });
                        if (formErrors.passwordConfirm) {
                          setFormErrors({ ...formErrors, passwordConfirm: undefined });
                        }
                      }}
                      className={formErrors.passwordConfirm ? "border-red-500" : ""}
                      aria-describedby={formErrors.passwordConfirm ? "passwordConfirm-error" : undefined}
                    />
                    {formErrors.passwordConfirm && (
                      <p id="passwordConfirm-error" className="text-red-500 text-sm mt-1">
                        {formErrors.passwordConfirm}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      名前 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) {
                          setFormErrors({ ...formErrors, name: undefined });
                        }
                      }}
                      className={formErrors.name ? "border-red-500" : ""}
                      aria-describedby={formErrors.name ? "name-error" : undefined}
                    />
                    {formErrors.name && (
                      <p id="name-error" className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">
                      性別
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="性別を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男性</SelectItem>
                        <SelectItem value="female">女性</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      年齢
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="introduction" className="text-sm font-medium">
                      自己紹介
                    </Label>
                    <Input
                      id="introduction"
                      value={formData.introduction}
                      onChange={(e) =>
                        setFormData({ ...formData, introduction: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      役割 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => {
                        setFormData({ ...formData, role: value });
                        if (formErrors.role) {
                          setFormErrors({ ...formErrors, role: undefined });
                        }
                      }}
                    >
                      <SelectTrigger className={formErrors.role ? "border-red-500" : ""}>
                        <SelectValue placeholder="役割を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worker">作業員</SelectItem>
                        <SelectItem value="manager">管理者</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.role}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateUser}
                    disabled={createUserMutation.isLoading}
                  >
                    {createUserMutation.isLoading ? "作成中..." : "作成"}
                  </Button>
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
                      <TableCell>{getRoleDisplay(user.role)}</TableCell>
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
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setSelectedUser(null);
              resetFormData();
            }
          }}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>ユーザー編集</DialogTitle>
                <DialogDescription>
                  ユーザー情報を編集します。
                </DialogDescription>
              </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-medium">
                    メールアドレス <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: undefined });
                      }
                    }}
                    className={formErrors.email ? "border-red-500" : ""}
                    aria-describedby={formErrors.email ? "edit-email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="edit-email-error" className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password" className="text-sm font-medium">
                    パスワード
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="新しいパスワードを入力（変更しない場合は空欄）"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (formErrors.password) {
                        setFormErrors({ ...formErrors, password: undefined });
                      }
                      // Clear password confirm error when password changes
                      if (formErrors.passwordConfirm) {
                        setFormErrors({ ...formErrors, passwordConfirm: undefined });
                      }
                    }}
                    className={formErrors.password ? "border-red-500" : ""}
                    aria-describedby={formErrors.password ? "edit-password-error" : "edit-password-help"}
                  />
                  <p id="edit-password-help" className="text-gray-500 text-sm mt-1">
                    パスワードを変更する場合のみ入力してください。6文字以上で入力してください。
                  </p>
                  {formErrors.password && (
                    <p id="edit-password-error" className="text-red-500 text-sm mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-passwordConfirm" className="text-sm font-medium">
                    パスワード確認
                  </Label>
                  <Input
                    id="edit-passwordConfirm"
                    type="password"
                    placeholder="パスワードを変更する場合のみ入力"
                    value={formData.passwordConfirm}
                    onChange={(e) => {
                      setFormData({ ...formData, passwordConfirm: e.target.value });
                      if (formErrors.passwordConfirm) {
                        setFormErrors({ ...formErrors, passwordConfirm: undefined });
                      }
                    }}
                    className={formErrors.passwordConfirm ? "border-red-500" : ""}
                    aria-describedby={formErrors.passwordConfirm ? "edit-passwordConfirm-error" : "edit-passwordConfirm-help"}
                  />
                  <p id="edit-passwordConfirm-help" className="text-gray-500 text-sm mt-1">
                    パスワードを変更する場合のみ入力してください。
                  </p>
                  {formErrors.passwordConfirm && (
                    <p id="edit-passwordConfirm-error" className="text-red-500 text-sm mt-1">
                      {formErrors.passwordConfirm}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium">
                    名前 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: undefined });
                      }
                    }}
                    className={formErrors.name ? "border-red-500" : ""}
                    aria-describedby={formErrors.name ? "edit-name-error" : undefined}
                  />
                  {formErrors.name && (
                    <p id="edit-name-error" className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender" className="text-sm font-medium">
                    性別
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="性別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男性</SelectItem>
                      <SelectItem value="female">女性</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-age" className="text-sm font-medium">
                    年齢
                  </Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role" className="text-sm font-medium">
                    役割 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => {
                      setFormData({ ...formData, role: value });
                      if (formErrors.role) {
                        setFormErrors({ ...formErrors, role: undefined });
                      }
                    }}
                  >
                    <SelectTrigger className={formErrors.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="役割を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">作業員</SelectItem>
                      <SelectItem value="manager">管理者</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.role}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-introduction" className="text-sm font-medium">
                    自己紹介
                  </Label>
                  <Input
                    id="edit-introduction"
                    value={formData.introduction}
                    onChange={(e) =>
                      setFormData({ ...formData, introduction: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleUpdateUser}
                  disabled={updateUserMutation.isLoading}
                >
                  {updateUserMutation.isLoading ? "更新中..." : "更新"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
            setIsViewDialogOpen(open);
            if (!open) {
              setSelectedUser(null);
            }
          }}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                  <Label className="text-right font-semibold">役割:</Label>
                  <div className="col-span-3">
                    {getRoleDisplay(selectedUser?.role || "")}
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
