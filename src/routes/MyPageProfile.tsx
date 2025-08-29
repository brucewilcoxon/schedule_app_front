import React, { useState } from "react";
import { useCreateUserProfile } from "../queries/UserQuery";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../@/components/ui/form";
import { useForm } from "react-hook-form";
import { Profile } from "../types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileValidationSchema } from "../@/components/ui/validationSchema";
import { Input } from "../@/components/ui/input";
import NoteHeader from "../components/NoteHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import Button from "../components/Button";
import { uploadProfileImage } from "../api/commonApi";
import { Avatar, AvatarFallback, AvatarImage } from "../@/components/ui/avatar";
import { z } from "zod";
import { useGetUser } from "../queries/AuthQuery";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";

const MyPageProfile = () => {
  const navigate = useNavigate();
  const { data: user } = useGetUser();
  const createProfile = useCreateUserProfile(navigate);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const profile = user?.user_profile || null;

  const uploadImage = async (file: File) => {
    try {
      const response = await uploadProfileImage(file);
      if (response.success) {
        console.log('Image uploaded successfully:', response.file_path);
        return response.file_path;
      } else {
        console.error("Image upload error:", response.error);
        alert('画像のアップロードに失敗しました: ' + response.error);
        return undefined;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert('画像のアップロードに失敗しました。もう一度お試しください。');
      return undefined;
    }
  };

  const form = useForm<Profile>({
    resolver: zodResolver(userProfileValidationSchema),
    mode: "onChange",
    defaultValues: {
      name: profile?.name || "",
      gender: profile?.gender || "",
      age: profile?.age || "",
      introduction: profile?.introduction || "",
      profile_image: profile?.profile_image || "",
    },
  });

  // Update form values when profile data changes
  React.useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        gender: profile.gender || "",
        age: profile.age || "",
        introduction: profile.introduction || "",
        profile_image: profile.profile_image || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (
    values: z.infer<typeof userProfileValidationSchema>
  ) => {
    // Convert empty strings to undefined and handle null values
    const profileData = {
      name: values.name || undefined,
      gender: values.gender || undefined,
      age: values.age || undefined,
      introduction: values.introduction || undefined,
      profile_image: selectedFile ? await uploadImage(selectedFile) : values.profile_image || undefined,
    };
    
    createProfile.mutate(profileData);
  };

  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        <Form {...form}>
          <div className="p-3">
            <h1 className="mb-4 text-center font-bold">
              プロフィールを編集する
            </h1>
            {!profile && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800 text-sm">
                  プロフィールがまだ作成されていません。以下のフォームでプロフィールを作成してください。
                </p>
              </div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={previewUrl || (profile?.profile_image ? `${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000'}/${profile.profile_image}` : undefined)}
                    alt={profile?.name || "Profile Image"}
                  />
                  <AvatarFallback>
                    {profile?.name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <FormField
                control={form.control}
                name="profile_image"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setPreviewUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="名前" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="性別" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">男性</SelectItem>
                          <SelectItem value="female">女性</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="年齢"
                        type="number"
                        min="1"
                        max="120"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
              <FormField
                control={form.control}
                name="introduction"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="自己紹介 (255文字以内)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Link to="/calendar">
                  <Button text="保存せずに戻る" className="text-gray-500" />
                </Link>
                <Button
                  text="保存する"
                  type="submit"
                  className="bg-gray-600 text-white"
                />
              </div>
            </form>
          </div>
        </Form>
      </RequireAuth>
    </Layout>
  );
};

export default MyPageProfile;
