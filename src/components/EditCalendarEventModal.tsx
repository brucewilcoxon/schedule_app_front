import React, { useEffect } from "react";
import { useUpdateCalendarEvent } from "../queries/CalenarQuery";
import { CalendarType } from "../types/Calendar";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarEventValidationShema } from "../@/components/ui/validationSchema";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import dayjs from "dayjs";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../@/components/ui/form";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../@/components/popover";
import { cn } from "../@/lib/utils";
import { Calendar } from "../@/components/ui/calendar";
import { ShadTextarea } from "../@/components/ui/textarea";
import { useGetUsers } from "../queries/UserQuery";
import { Checkbox } from "../@/components/ui/checkbox";
import { useGetUser } from "../queries/AuthQuery";
import { RadioGroup, RadioGroupItem } from "../@/components/ui/radio-group";
import { Label } from "../@/components/ui/label";

interface ModalProps {
  modalOpen: boolean;
  clickModalClose: () => void;
  calendarEvent: CalendarType;
}

const EditCalendarEventModal: React.FC<ModalProps> = ({
  modalOpen,
  clickModalClose,
  calendarEvent,
}) => {
  const updateCalendarEvent = useUpdateCalendarEvent();
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const { data: user } = useGetUser();

  // Parse existing content to extract fields
  const existingFields = {
    workers: calendarEvent.workers || [],
    vehicleInfo: calendarEvent.vehicle_info || "",
    repairType: Array.isArray(calendarEvent.repair_type) ? calendarEvent.repair_type : (calendarEvent.repair_type ? [calendarEvent.repair_type] : []),
    workType: calendarEvent.work_type || "",
    status: calendarEvent.status || "未開始",
    description: calendarEvent.description || "",
    isDelayed: calendarEvent.is_delayed || false,
  };


  const form = useForm({
    resolver: zodResolver(CalendarEventValidationShema),
    mode: "onChange",
    defaultValues: {
      workers: existingFields.workers as string[],
      vehicleInfo: existingFields.vehicleInfo,
      repairType: existingFields.repairType,
      workType: existingFields.workType,
      status: existingFields.status,
      description: existingFields.description,
      start: calendarEvent.start,
      end: dayjs(calendarEvent.end).add(-1, "day").format("YYYY-MM-DD"),
      isDelayed: existingFields.isDelayed,
    },
  });

  const { isSubmitting, isValid } = useFormState(form);
  const selectedWorkers = form.watch("workers") || [];
  const selectedRepairTypes = form.watch("repairType") || [];
  const selectedStatus = form.watch("status");


  // Reset form when calendarEvent changes
  useEffect(() => {
    const newExistingFields = {
      workers: calendarEvent.workers || [],
      vehicleInfo: calendarEvent.vehicle_info || "",
      repairType: Array.isArray(calendarEvent.repair_type) ? calendarEvent.repair_type : (calendarEvent.repair_type ? [calendarEvent.repair_type] : []),
      workType: calendarEvent.work_type || "",
      status: calendarEvent.status || "未開始",
      description: calendarEvent.description || "",
      isDelayed: calendarEvent.is_delayed || false,
    };

    form.reset({
      workers: newExistingFields.workers as string[],
      vehicleInfo: newExistingFields.vehicleInfo,
      repairType: newExistingFields.repairType,
      workType: newExistingFields.workType,
      status: newExistingFields.status,
      description: newExistingFields.description,
      start: calendarEvent.start,
      end: dayjs(calendarEvent.end).add(-1, "day").format("YYYY-MM-DD"),
      isDelayed: newExistingFields.isDelayed,
    });
  }, [calendarEvent, form]);

  function onSubmit(values: any) {
    const formatValues = {
      vehicle_info: values.vehicleInfo,
      repair_type: values.repairType,
      work_type: values.workType,
      workers: values.workers,
      status: values.status,
      description: values.description,
      start: values.start,
      end: values.end ? dayjs(values.end).add(1, "day").format("YYYY-MM-DD") : values.start,
      is_delayed: values.isDelayed,
    };
    updateCalendarEvent.mutate({
      id: calendarEvent.id,
      values: formatValues,
    });
    clickModalClose();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={clickModalClose}>
      <DialogContent className="max-w-[375px] xs:max-w-[425px] w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-5 text-lg">スケジュールを編集</DialogTitle>
          <DialogDescription className="text-sm">
            カレンダーイベントを編集します
            {user?.role === 'manager' && user?.id !== calendarEvent.user.id && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                管理者権限で編集中
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            key={calendarEvent.id}
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              const values = form.getValues();
              onSubmit(values);
            }}
          >
            <FormField
              control={form.control}
              name="vehicleInfo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="mb-1" {...field} placeholder="車両情報・顧客名" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repairType"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">修理の種類 (最大3つまで選択可能)</div>
                    <div className="text-xs text-gray-500">
                      選択済み: {selectedRepairTypes.length}/3
                    </div>
                    <Select
                      onValueChange={(value) => {
                        if (!selectedRepairTypes.includes(value) && selectedRepairTypes.length < 3) {
                          const newRepairTypes = [...selectedRepairTypes, value];
                          field.onChange(newRepairTypes);
                        }
                      }}
                      disabled={selectedRepairTypes.length >= 3}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="修理の種類を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-64 overflow-y-auto">
                        <SelectItem value="冷却不良">冷却不良</SelectItem>
                        <SelectItem value="異音がする">異音がする</SelectItem>
                        <SelectItem value="ベルト鳴き">ベルト鳴き</SelectItem>
                        <SelectItem value="エンジン始動不良">エンジン始動不良</SelectItem>
                        <SelectItem value="ユニット作動不良">ユニット作動不良</SelectItem>
                        <SelectItem value="スタンバイ作動不良">スタンバイ作動不良</SelectItem>
                        <SelectItem value="電源入らず">電源入らず</SelectItem>
                        <SelectItem value="異臭・煙が出た">異臭・煙が出た</SelectItem>
                        <SelectItem value="ファンモーター回らず">ファンモーター回らず</SelectItem>
                        <SelectItem value="冷凍機　新規取付・載せ換え">冷凍機　新規取付・載せ換え</SelectItem>
                        <SelectItem value="シーズンイン点検">シーズンイン点検</SelectItem>
                        <SelectItem value="定期点検">定期点検</SelectItem>
                        <SelectItem value="庫内洗浄">庫内洗浄</SelectItem>
                        <SelectItem value="オイル交換">オイル交換</SelectItem>
                        <SelectItem value="フェリー乗船前点検">フェリー乗船前点検</SelectItem>
                        <SelectItem value="定置冷蔵庫　製作・修理・入替">定置冷蔵庫　製作・修理・入替</SelectItem>
                        <SelectItem value="パーキングヒーター　取付・修理">パーキングヒーター　取付・修理</SelectItem>
                        <SelectItem value="パーキングクーラー　取付・修理">パーキングクーラー　取付・修理</SelectItem>
                        <SelectItem value="入庫">入庫</SelectItem>
                        <SelectItem value="出張">出張</SelectItem>
                        <SelectItem value="休日・時間外緊急対応">休日・時間外緊急対応</SelectItem>
                        <SelectItem value="見積り・現調">見積り・現調</SelectItem>
                        <SelectItem value="外注依頼">外注依頼</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedRepairTypes.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium">選択された修理の種類:</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedRepairTypes.map((repairType, index) => (
                            <div
                              key={`${repairType}-${index}`}
                              className="flex items-center gap-2 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                            >
                              <span>{repairType}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newRepairTypes = selectedRepairTypes.filter((_, i) => i !== index);
                                  field.onChange(newRepairTypes);
                                }}
                                className="text-green-600 hover:text-green-800 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
             <FormField
               control={form.control}
               name="workType"
               render={({ field }) => (
                 <FormItem>
                   <div className="space-y-4">
                     <div className="text-sm font-semibold text-gray-700">作業タイプ</div>
                     <FormControl>
                       <RadioGroup
                         onValueChange={field.onChange}
                         value={field.value}
                         className="grid grid-cols-1 xs:grid-cols-2 gap-3"
                       >
                         <div className="relative">
                           <RadioGroupItem 
                             value="入庫作業" 
                             id="入庫作業" 
                             className="peer sr-only"
                           />
                           <Label 
                             htmlFor="入庫作業" 
                             className={`flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                               field.value === "入庫作業" 
                                 ? "border-blue-500 bg-blue-50 shadow-md scale-105" 
                                 : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                             }`}
                           >
                             <div className="flex items-center space-x-3">
                               <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                                 field.value === "入庫作業" 
                                   ? "border-blue-500 bg-blue-500" 
                                   : "border-gray-300"
                               }`}>
                                 <div className={`w-2 h-2 bg-white rounded-full transition-opacity duration-300 ${
                                   field.value === "入庫作業" ? "opacity-100" : "opacity-0"
                                 }`}></div>
                               </div>
                               <div className="text-center">
                                 <div className="text-sm font-medium text-gray-700">入庫作業</div>
                  
                               </div>
                             </div>
                           </Label>
                         </div>
                         <div className="relative">
                           <RadioGroupItem 
                             value="出張作業" 
                             id="出張作業" 
                             className="peer sr-only"
                           />
                           <Label 
                             htmlFor="出張作業" 
                             className={`flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                               field.value === "出張作業" 
                                 ? "border-green-500 bg-green-50 shadow-md scale-105" 
                                 : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                             }`}
                           >
                             <div className="flex items-center space-x-3">
                               <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                                 field.value === "出張作業" 
                                   ? "border-green-500 bg-green-500" 
                                   : "border-gray-300"
                               }`}>
                                 <div className={`w-2 h-2 bg-white rounded-full transition-opacity duration-300 ${
                                   field.value === "出張作業" ? "opacity-100" : "opacity-0"
                                 }`}></div>
                               </div>
                               <div className="text-center">
                                 <div className="text-sm font-medium text-gray-700">出張作業</div>
                  
                               </div>
                             </div>
                           </Label>
                         </div>
                       </RadioGroup>
                     </FormControl>
                     <FormMessage />
                   </div>
                 </FormItem>
               )}
             />
            <FormField
              control={form.control}
              name="workers"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">作業員 (最大3人まで選択可能)</div>
                    <div className="text-xs text-gray-500">
                      選択済み: {selectedWorkers.length}/3
                    </div>
                    {usersLoading ? (
                      <div className="text-sm text-gray-500">読み込み中...</div>
                    ) : (
                      <Select
                        onValueChange={(value) => {
                          if (!selectedWorkers.includes(value) && selectedWorkers.length < 3) {
                            const newWorkers = [...selectedWorkers, value];
                            field.onChange(newWorkers);
                          }
                        }}
                        disabled={selectedWorkers.length >= 3}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="作業員を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-40 overflow-y-auto">
                          {users?.map((user) => {
                            const userName = user.user_profile?.name || user.email;
                            if (!userName || selectedWorkers.includes(userName)) return null;
                            
                            return (
                              <SelectItem key={user.id} value={userName}>
                                {userName}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                    {selectedWorkers.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium">選択された作業員:</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorkers.map((worker, index) => (
                            <div
                              key={`${worker}-${index}`}
                              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                            >
                              <span>{worker}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newWorkers = selectedWorkers.filter((_, i) => i !== index);
                                  field.onChange(newWorkers);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            {/* Checkbox for delayed status - only shows when status is "完了" */}
            {selectedStatus === "完了" && (
              <FormField
                control={form.control}
                name="isDelayed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 hover:data-[state=checked]:bg-orange-600 focus:ring-orange-500 focus:ring-offset-2"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <label className="text-sm font-semibold text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        延期されましたか？
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        スケジュールが予定より遅れて完了した場合はチェックしてください
                      </p>
                    </div>
                    <div className="ml-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-xs">⚠</span>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-[100%]">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="未開始">
                          {field.value && (
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                field.value === "未開始" ? "bg-gray-500 border-gray-300" :
                                field.value === "作業中" ? "bg-blue-500 border-blue-300" :
                                field.value === "見積り保留中" ? "bg-yellow-500 border-yellow-300" :
                                field.value === "部品待ち保留中" ? "bg-orange-500 border-orange-300" :
                                field.value === "完了" ? "bg-green-500 border-green-300" :
                                field.value === "連絡済み" ? "bg-purple-500 border-purple-300" :
                                "bg-gray-500 border-gray-300"
                              }`}></div>
                              <span className="font-medium">{field.value}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem 
                        value="未開始"
                        className="text-gray-800 hover:bg-gray-200 focus:bg-gray-200 data-[state=checked]:bg-gray-200"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-gray-300"></div>
                          <span className="font-medium">未開始</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="作業中"
                        className="text-blue-800 hover:bg-blue-200 focus:bg-blue-200 data-[state=checked]:bg-blue-200"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-300"></div>
                          <span className="font-medium">作業中</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="見積り保留中"
                        className="text-yellow-800 hover:bg-yellow-200 focus:bg-yellow-200 data-[state=checked]:bg-yellow-200"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-300"></div>
                          <span className="font-medium">見積り保留中</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="部品待ち保留中"
                        className="text-orange-800 hover:bg-orange-200 focus:bg-orange-200 data-[state=checked]:bg-orange-200"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-orange-300"></div>
                          <span className="font-medium">部品待ち保留中</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="完了"
                        className="text-green-800 hover:bg-green-200 focus:bg-green-200 data-[state=checked]:bg-green-200"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-300"></div>
                          <span className="font-medium">完了</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="連絡済み"
                        className="text-purple-800 hover:bg-purple-200 focus:bg-purple-200 data-[state=checked]:bg-purple-200"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-300"></div>
                          <span className="font-medium">連絡済み</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col xs:flex-row gap-3">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full xs:w-[50%]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal text-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "yyyy-MM-dd", {
                                locale: ja,
                              })
                            ) : (
                              <span>開始日</span>
                            )}
                            <CalendarTodayOutlinedIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[9999]"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? dayjs(field.value).toDate()
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(dayjs(date).format("YYYY-MM-DD"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full xs:w-[50%]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal text-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "yyyy-MM-dd", {
                                locale: ja,
                              })
                            ) : (
                              <span>終了日 (任意)</span>
                            )}
                            <CalendarTodayOutlinedIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-[9999]"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? dayjs(field.value).toDate()
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(dayjs(date).format("YYYY-MM-DD"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ShadTextarea {...field} placeholder="修理作業の詳細な説明..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col xs:flex-row justify-end items-center gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="bg-blue-600 hover:bg-blue-700 w-full xs:w-auto"
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                更新する
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clickModalClose}
                className="w-full xs:w-auto"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCalendarEventModal;
