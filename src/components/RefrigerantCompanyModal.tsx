import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../@/components/ui/dialog";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { Label } from "../@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { Checkbox } from "../@/components/ui/checkbox";
import { RefrigerantCompany, CreateRefrigerantCompanyData, getUserProfiles } from "../api/refrigerantCompanyApi";

const RefrigerantCompanySchema = z.object({
  item: z.string().min(1, "項目を入力してください"),
  process_type: z.enum(["collection", "filling", "collection_filling"], {
    required_error: "プロセスタイプを選択してください",
  }),
  delivery_date: z.string().min(1, "交付年月日を入力してください"),
  is_selected: z.boolean().default(false),
  owner: z.string().optional(),
  manager_id: z.number().optional(),
  residence: z.string().optional(),
});

type RefrigerantCompanyFormData = z.infer<typeof RefrigerantCompanySchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRefrigerantCompanyData) => void;
  company?: RefrigerantCompany | null;
  isLoading?: boolean;
}

const RefrigerantCompanyModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  company,
  isLoading = false,
}) => {
  const { data: userProfiles = [] } = useQuery("user-profiles", getUserProfiles);

  const form = useForm<RefrigerantCompanyFormData>({
    resolver: zodResolver(RefrigerantCompanySchema),
    defaultValues: {
      item: "",
      process_type: "collection",
      delivery_date: "",
      is_selected: false,
      owner: "",
      manager_id: undefined,
      residence: "",
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        item: company.item,
        process_type: company.process_type,
        delivery_date: company.delivery_date,
        is_selected: company.is_selected,
        owner: company.owner || "",
        manager_id: company.manager_id || undefined,
        residence: company.residence || "",
      });
    } else {
      form.reset({
        item: "",
        process_type: "collection",
        delivery_date: "",
        is_selected: false,
        owner: "",
        manager_id: undefined,
        residence: "",
      });
    }
  }, [company, form]);

  const handleSubmit = (values: RefrigerantCompanyFormData) => {
    onSubmit(values);
  };

  const processTypeOptions = [
    { value: "collection", label: "回収" },
    { value: "filling", label: "充填" },
    { value: "collection_filling", label: "回収充填" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {company ? "冷媒会社を編集" : "冷媒会社を追加"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">項目</Label>
            <Input
              id="item"
              {...form.register("item")}
              placeholder="項目を入力"
            />
            {form.formState.errors.item && (
              <p className="text-sm text-red-500">
                {form.formState.errors.item.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="process_type">回収・充填・回収充填</Label>
            <Select
              value={form.watch("process_type")}
              onValueChange={(value) =>
                form.setValue("process_type", value as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="プロセスタイプを選択" />
              </SelectTrigger>
              <SelectContent>
                {processTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.process_type && (
              <p className="text-sm text-red-500">
                {form.formState.errors.process_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_date">交付年月日</Label>
            <Input
              id="delivery_date"
              type="date"
              {...form.register("delivery_date")}
            />
            {form.formState.errors.delivery_date && (
              <p className="text-sm text-red-500">
                {form.formState.errors.delivery_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">所有者</Label>
            <Input
              id="owner"
              {...form.register("owner")}
              placeholder="所有者を入力"
            />
            {form.formState.errors.owner && (
              <p className="text-sm text-red-500">
                {form.formState.errors.owner.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager_id">管理者</Label>
            <Select
              value={form.watch("manager_id")?.toString() || ""}
              onValueChange={(value) =>
                form.setValue("manager_id", value ? parseInt(value) : undefined)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="管理者を選択" />
              </SelectTrigger>
              <SelectContent>
                {userProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id.toString()}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.manager_id && (
              <p className="text-sm text-red-500">
                {form.formState.errors.manager_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="residence">住所</Label>
            <Input
              id="residence"
              {...form.register("residence")}
              placeholder="住所を入力"
            />
            {form.formState.errors.residence && (
              <p className="text-sm text-red-500">
                {form.formState.errors.residence.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_selected"
              checked={form.watch("is_selected")}
              onCheckedChange={(checked) =>
                form.setValue("is_selected", checked as boolean)
              }
            />
            <Label htmlFor="is_selected">○を付ける</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : company ? "更新" : "作成"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RefrigerantCompanyModal; 