import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../@/components/ui/dialog";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { Label } from "../@/components/ui/label";
import { Checkbox } from "../@/components/ui/checkbox";
import { CreateRefrigerantWorkplaceData, RefrigerantWorkplace } from "../api/refrigerantWorkplaceApi";

const Schema = z.object({
  business: z.string().min(1, "事業所(使用先)を入力してください"),
  residence: z.string().optional(),
  vehicle_registration_number: z.string().optional(),
  serial_number: z.string().optional(),
  machine_type: z.string().optional(),
  gas_type: z.string().optional(),
  initial_fill_amount: z
    .preprocess((v) => (v === "" || v === undefined ? undefined : Number(v)), z.number().nonnegative().optional()),
  is_selected: z.boolean().default(false),
});

export type RefrigerantWorkplaceForm = z.infer<typeof Schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRefrigerantWorkplaceData) => void;
  initial?: RefrigerantWorkplace | null;
  isLoading?: boolean;
}

const RefrigerantWorkplaceModal: React.FC<Props> = ({ open, onClose, onSubmit, initial, isLoading = false }) => {
  const form = useForm<RefrigerantWorkplaceForm>({
    resolver: zodResolver(Schema),
    defaultValues: {
      business: "",
      residence: "",
      vehicle_registration_number: "",
      serial_number: "",
      machine_type: "",
      gas_type: "",
      initial_fill_amount: undefined,
      is_selected: false,
    },
  });

  useEffect(() => {
    if (initial) {
      form.reset({
        business: initial.business,
        residence: initial.residence || "",
        vehicle_registration_number: initial.vehicle_registration_number || "",
        serial_number: initial.serial_number || "",
        machine_type: initial.machine_type || "",
        gas_type: initial.gas_type || "",
        initial_fill_amount: initial.initial_fill_amount as any,
        is_selected: initial.is_selected,
      });
    } else {
      form.reset({
        business: "",
        residence: "",
        vehicle_registration_number: "",
        serial_number: "",
        machine_type: "",
        gas_type: "",
        initial_fill_amount: undefined,
        is_selected: false,
      });
    }
  }, [initial, form]);

  const handleSubmit = (values: RefrigerantWorkplaceForm) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{initial ? "事業所情報を編集" : "事業所情報を追加"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="business">事業所(使用先)</Label>
              <Input id="business" {...form.register("business")} placeholder="例) 東京第一事業所" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="residence">住所</Label>
              <Input id="residence" {...form.register("residence")} placeholder="例) 東京都港区..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_registration_number">車両登録番号</Label>
              <Input id="vehicle_registration_number" {...form.register("vehicle_registration_number")} placeholder="例) 品川300 あ 12-34" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serial_number">シリアル番号</Label>
              <Input id="serial_number" {...form.register("serial_number")} placeholder="例) SN-123456" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="machine_type">機種</Label>
              <Input id="machine_type" {...form.register("machine_type")} placeholder="例) パッケージエアコン" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gas_type">ガスタイプ</Label>
              <Input id="gas_type" {...form.register("gas_type")} placeholder="例) R-410A" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial_fill_amount">初期充填量(kg)</Label>
              <Input id="initial_fill_amount" type="number" step="0.01" {...form.register("initial_fill_amount")} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_selected"
              checked={form.watch("is_selected")}
              onCheckedChange={(checked) => form.setValue("is_selected", checked as boolean)}
            />
            <Label htmlFor="is_selected">○を付ける</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : initial ? "更新" : "作成"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RefrigerantWorkplaceModal; 