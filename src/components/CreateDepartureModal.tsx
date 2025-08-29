import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Cross1Icon, CalendarIcon, UploadIcon, FileTextIcon } from "@radix-ui/react-icons";

import { Input } from "../@/components/ui/input";
import { Button } from "../@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { Calendar } from "../@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../@/components/ui/popover";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "../@/lib/utils";
import { CreateHeaderModalProps } from "../types/ModalProps";
import { addLog } from "../utils/refrigerantStorage";
import { REFRIGERANT_GWP_VALUES } from "../types/Refrigerant";

// Validation schema for refrigerant usage
const RefrigerantUsageSchema = z.object({
  projectType: z.string().min(1, "項目を選択してください"),
  date: z.date(),
  refrigerantType: z.string().min(1, "フロン名称・種類を選択してください"),
  recoveryAmount: z.number().min(0, "回収量は0以上で入力してください").optional(),
  fillingDate: z.date().optional(),
  fillingAmount: z.number().min(0, "充填量は0以上で入力してください").optional(),
  additionalFillingAmount: z.number().min(0, "追加充填量は0以上で入力してください").optional(),
});

export type RefrigerantUsageType = z.infer<typeof RefrigerantUsageSchema>;

const CreateDepartureModal: React.FC<CreateHeaderModalProps> = ({
  clickModalClose,
}) => {
  const form = useForm<RefrigerantUsageType>({
    resolver: zodResolver(RefrigerantUsageSchema),
    defaultValues: {
      projectType: "",
      date: new Date(),
      refrigerantType: "",
      recoveryAmount: 0,
      fillingDate: undefined,
      fillingAmount: 0,
      additionalFillingAmount: 0,
    },
  });

  const projectTypes = [
    { value: "回収", label: "回収" },
    { value: "充填", label: "充填" },
    { value: "回収充填", label: "回収充填" }
  ];


  const freonNames = [
    "R134a HFC", "R404A HFC", "R22 HCFC", "R403B HFC", "R502 CFC", "R12 CFC"
  ];


  const watchProjectType = form.watch("projectType");
  const watchRecoveryAmount = form.watch("recoveryAmount") || 0;
  const watchFillingAmount = form.watch("fillingAmount") || 0;
  const watchAdditionalFillingAmount = form.watch("additionalFillingAmount") || 0;

  // Calculate leakage amount
  const leakageAmount = (watchFillingAmount + watchAdditionalFillingAmount) - watchRecoveryAmount;

  const onSubmit = (values: RefrigerantUsageType) => {
    const logData = {
      id: Date.now(),
      ...values,
      date: values.date.toISOString(),
      fillingDate: values.fillingDate?.toISOString(),
      leakageAmount: leakageAmount,
      gwpValue: REFRIGERANT_GWP_VALUES[values.refrigerantType] || 0,
    };

    addLog(logData as any);
    clickModalClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileTextIcon className="w-6 h-6 text-blue-600" />
            冷媒作業記録
          </h1>
          <button
            onClick={clickModalClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Cross1Icon className="w-5 h-5" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 項目 (Project Type) */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileTextIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900">項目</h2>
              </div>
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="項目を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 月日 (Date) */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-green-900">月日</h2>
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
                            ) : (
                              <span>日付を選択してください</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                          }}
                          initialFocus
                          locale={ja}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* フロン名称・種類 (Freon Name & Type) */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileTextIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-purple-900">フロン名称・種類</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="refrigerantType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-sm text-gray-600 mb-1">フロン名称・種類</div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="フロン名称・種類を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {freonNames.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 回収作業 (Recovery Work) */}
            {(watchProjectType === "回収" || watchProjectType === "回収充填") && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <UploadIcon className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-orange-900">回収作業</h2>
                </div>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="recoveryAmount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="text-sm text-gray-600 mb-1">回収量 (kg)</div>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0.0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* 充填作業 (Filling Work) */}
            {(watchProjectType === "充填" || watchProjectType === "回収充填") && (
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileTextIcon className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-semibold text-teal-900">充填作業</h2>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fillingDate"
                    render={({ field }) => (
                      <FormItem>
                        <div className="text-sm text-gray-600 mb-1">充填日</div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>充填日を選択してください</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                              }}
                              initialFocus
                              locale={ja}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fillingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <div className="text-sm text-gray-600 mb-1">充填量 (kg)</div>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalFillingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <div className="text-sm text-gray-600 mb-1">追加充填量 (kg)</div>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 漏れ量計算結果 (Leakage Calculation Result) */}
            {(watchProjectType === "回収充填") && (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileTextIcon className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-red-900">漏れ量計算結果</h2>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm text-gray-600 mb-1">計算式: 充填量 + 追加充填量 - 回収量</div>
                  <div className="text-lg font-bold text-red-700">
                    漏れ量: {leakageAmount.toFixed(1)} kg
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ({watchFillingAmount} + {watchAdditionalFillingAmount} - {watchRecoveryAmount})
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                保存
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clickModalClose}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateDepartureModal;
