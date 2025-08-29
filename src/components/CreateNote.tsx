import React from "react";
import { CreateHeaderModalProps } from "../types/ModalProps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Note } from "../types/Note";
import { NoteValidationShema } from "../@/components/ui/validationSchema";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../@/components/ui/form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { z } from "zod";
import { ShadTextarea } from "../@/components/ui/textarea";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { useCreateNote } from "../queries/NoteQuery";
import { Popover } from "../@/components/popover";
import { PopoverContent, PopoverTrigger } from "../@/components/ui/popover";
import { Calendar } from "../@/components/ui/calendar";
import { cn } from "../@/lib/utils";
import dayjs from "dayjs";
const CreateNote: React.FC<CreateHeaderModalProps> = ({ clickModalClose }) => {
  const createNote = useCreateNote();
  const form = useForm<Note>({
    resolver: zodResolver(NoteValidationShema),
  });

  function onSubmit(values: z.infer<typeof NoteValidationShema>) {
    console.log(values);
    createNote.mutate(values);
    clickModalClose();
  }

  return (
    <Form {...form}>
      <h1 className="mb-4 text-center font-bold">ノートを投稿する</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="タイトル" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ShadTextarea {...field} placeholder="内容" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "yyyy-MM-dd", {
                          locale: ja,
                        })
                      ) : (
                        <span>出艇日</span>
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

        <div className="flex justify-end items-center">
          <a onClick={clickModalClose}>キャンセル</a>
          <Button className="ml-3 bg-gray-600" type="submit">
            投稿する
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateNote;
