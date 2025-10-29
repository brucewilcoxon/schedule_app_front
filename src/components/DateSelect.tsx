// import { zodResolver } from "@hookform/resolvers/zod";

// import { format } from "date-fns";
// import { UseFormReturn, useForm } from "react-hook-form";
// import { z } from "zod";

// import { cn } from "../@/lib/utils";

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../@/components/ui/form";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "../@/components/ui/popover";
// import { toast } from "../@/components/ui/use-toast";
// import { Button } from "../@/components/ui/button";
// import { CalendarIcon } from "lucide-react";
// import { Calendar } from "../@/components/ui/calendar";
// import { Note } from "../types/Note";

// interface DatePickerFormProps {
//   form: UseFormReturn<any>; // ここで具体的な型を指定することもできますが、一般的な使用のために `any` を使用しています。
// }

// export function DatePickerForm({ form }: DatePickerFormProps) {
//   return (
//     <>
//       <FormField<Note>
//         control={form.control}
//         name="date"
//         render={({ field }) => (
//           <FormItem className="flex flex-col">
//             <Popover>
//               <PopoverTrigger asChild>
//                 <FormControl>
//                   <Button
//                     variant={"outline"}
//                     className={cn(
//                       "w-full pl-3 text-left font-normal",
//                       !field.value && "text-muted-foreground"
//                     )}
//                   >
//                     {field.value ? (
//                       format(field.value, "PPP")
//                     ) : (
//                       <span>日付</span>
//                     )}
//                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                   </Button>
//                 </FormControl>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0 z-[9999]" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={new Date(field.value)}
//                   onSelect={(date: Date | undefined) => {
//                     if (date) {
//                       field.onChange(date.toISOString());
//                     }
//                   }}
//                   disabled={(date: Date) =>
//                     date > new Date() || date < new Date("1900-01-01")
//                   }
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </>
//   );
// }

import React from "react";

const DateSelect = () => {
  return <div></div>;
};

export default DateSelect;
