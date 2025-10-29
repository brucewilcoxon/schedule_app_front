import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../@/components/ui/form";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarEventValidationShema } from "../@/components/ui/validationSchema";
import { CreateHeaderModalProps } from "../types/ModalProps";
import { Input } from "../@/components/ui/input";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Button } from "../@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../@/components/popover";
import { cn } from "../@/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar } from "../@/components/ui/calendar";
import { useCreateCalendarEvent } from "../queries/CalenarQuery";
import dayjs from "dayjs";
import { ShadTextarea } from "../@/components/ui/textarea";
import { useGetUsers } from "../queries/UserQuery";
import { Checkbox } from "../@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../@/components/ui/radio-group";
import { Label } from "../@/components/ui/label";

const CreateCalendarEvent: React.FC<CreateHeaderModalProps> = ({
  clickModalClose,
}) => {
  const form = useForm({
    resolver: zodResolver(CalendarEventValidationShema),
    mode: "onChange",
    defaultValues: {
      workers: [] as string[],
      vehicleInfo: "",
      repairType: [] as string[],
      workType: "",
      status: "",
      description: "",
      start: "",
      end: "",
      isDelayed: false,
    },
  });

  const createEvent = useCreateCalendarEvent();
  const { data: users, isLoading: usersLoading } = useGetUsers();

  function onsubmit(values: any) {
    const formatValues = {
      vehicle_info: values.vehicleInfo,
      repair_type: values.repairType,
      work_type: values.workType,
      workers: values.workers,
      status: values.status,
      description: values.description,
      start: values.start,
      end: values.end ? values.end : values.start,
      is_delayed: values.isDelayed,
    };
    createEvent.mutate(formatValues);
    clickModalClose();
  }

  const { isSubmitting, isValid } = useFormState(form);

  const selectedWorkers = form.watch("workers") || [];
  const selectedRepairTypes = form.watch("repairType") || [];
  const selectedStatus = form.watch("status");

  return (
    <Form {...form}>
      <form className="space-y-4 sm:space-y-6" onSubmit={form.handleSubmit(onsubmit)}>
        <h1 className="mb-4 text-center font-bold text-lg sm:text-xl">新しいスケジュール</h1>
        
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
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && !selectedRepairTypes.includes(value) && selectedRepairTypes.length < 3) {
                      const newRepairTypes = [...selectedRepairTypes, value];
                      field.onChange(newRepairTypes);
                      e.target.value = ''; // Reset select after selection
                    }
                  }}
                  disabled={selectedRepairTypes.length >= 3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">修理の種類を選択してください</option>
                  <option value="冷却不良">冷却不良</option>
                  <option value="異音がする">異音がする</option>
                  <option value="ベルト鳴き">ベルト鳴き</option>
                  <option value="エンジン始動不良">エンジン始動不良</option>
                  <option value="ユニット作動不良">ユニット作動不良</option>
                  <option value="スタンバイ作動不良">スタンバイ作動不良</option>
                  <option value="電源入らず">電源入らず</option>
                  <option value="異臭・煙が出た">異臭・煙が出た</option>
                  <option value="ファンモーター回らず">ファンモーター回らず</option>
                  <option value="冷凍機　新規取付・載せ換え">冷凍機　新規取付・載せ換え</option>
                  <option value="シーズンイン点検">シーズンイン点検</option>
                  <option value="定期点検">定期点検</option>
                  <option value="庫内洗浄">庫内洗浄</option>
                  <option value="オイル交換">オイル交換</option>
                  <option value="フェリー乗船前点検">フェリー乗船前点検</option>
                  <option value="定置冷蔵庫　製作・修理・入替">定置冷蔵庫　製作・修理・入替</option>
                  <option value="パーキングヒーター　取付・修理">パーキングヒーター　取付・修理</option>
                  <option value="パーキングクーラー　取付・修理">パーキングクーラー　取付・修理</option>
                  <option value="入庫">入庫</option>
                  <option value="出張">出張</option>
                  <option value="休日・時間外緊急対応">休日・時間外緊急対応</option>
                  <option value="見積り・現調">見積り・現調</option>
                  <option value="外注依頼">外注依頼</option>
                  <option value="その他">その他</option>
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
               <div className="space-y-2">
                 <div className="text-sm font-semibold text-gray-700">作業タイプ</div>
                 <FormControl>
                   <RadioGroup
                     onValueChange={field.onChange}
                     value={field.value}
                     className="grid grid-cols-2 gap-2"
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
                  <option value="">未開始</option>
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
          
          <div className="flex flex-col sm:flex-row gap-3">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full sm:w-[50%]">
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
                  <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? dayjs(field.value).toDate() : undefined
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
            <FormItem className="flex flex-col w-full sm:w-[50%]">
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
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? dayjs(field.value).toDate() : undefined
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
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            スケジュールを作成
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clickModalClose}
            className="w-full sm:w-auto"
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCalendarEvent;
