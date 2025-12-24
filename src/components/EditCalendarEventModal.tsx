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
import { useGetRepairTypeOptions } from "../queries/RepairTypeOptionQuery";
import { Link } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import ImageUpload from "./ImageUpload";

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
  const { data: repairTypeOptions = [], isLoading: repairTypeOptionsLoading } = useGetRepairTypeOptions();

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
      images: calendarEvent.images || [],
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
      images: calendarEvent.images || [],
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
      images: newExistingFields.images,
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
      images: values.images || [],
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
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      images={Array.isArray(field.value) ? field.value : []}
                      onImagesChange={field.onChange}
                      maxImages={10}
                    />
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
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">修理の種類 (最大7つまで選択可能)</div>
                      <Link to="/repairTypeManagement">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2"
                        >
                          <SettingsIcon fontSize="small" className="mr-1" />
                          管理
                        </Button>
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500">
                      選択済み: {selectedRepairTypes.length}/7
                    </div>
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && !selectedRepairTypes.includes(value) && selectedRepairTypes.length < 7) {
                          const newRepairTypes = [...selectedRepairTypes, value];
                          field.onChange(newRepairTypes);
                          e.target.value = ''; // Reset select after selection
                        }
                      }}
                      disabled={selectedRepairTypes.length >= 7 || repairTypeOptionsLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {repairTypeOptionsLoading ? "読み込み中..." : "修理の種類を選択してください"}
                      </option>
                      {repairTypeOptions && repairTypeOptions.length > 0 && repairTypeOptions
                        .filter(option => !selectedRepairTypes.includes(option.name))
                        .map((option) => (
                          <option key={option.id} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                    </select>
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
                      <select
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && !selectedWorkers.includes(value) && selectedWorkers.length < 3) {
                            const newWorkers = [...selectedWorkers, value];
                            field.onChange(newWorkers);
                            e.target.value = ''; // Reset select after selection
                          }
                        }}
                        disabled={selectedWorkers.length >= 3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">作業員を選択してください</option>
                        {users?.map((user) => {
                          const userName = user.user_profile?.name || user.email;
                          if (!userName || selectedWorkers.includes(userName)) return null;
                          
                          return (
                            <option key={user.id} value={userName}>
                              {userName}
                            </option>
                          );
                        })}
                      </select>
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
                  <select 
                    onChange={(e) => field.onChange(e.target.value)} 
                    value={field.value}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="未開始">未開始</option>
                    <option value="作業中">作業中</option>
                    <option value="見積り保留中">見積り保留中</option>
                    <option value="部品待ち保留中">部品待ち保留中</option>
                    <option value="完了">完了</option>
                    <option value="連絡済み">連絡済み</option>
                  </select>
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
