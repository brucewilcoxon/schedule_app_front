import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DeleteNote, Note } from "../types/Note";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoteValidationShema } from "../@/components/ui/validationSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../@/components/ui/form";
import { Input } from "../@/components/ui/input";
import { Button } from "../@/components/ui/button";
import { ShadTextarea } from "../@/components/ui/textarea";
import { useUpdateNote } from "../queries/NoteQuery";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../@/components/ui/dialog";
import { Popover } from "../@/components/popover";
import { PopoverContent, PopoverTrigger } from "../@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "../@/lib/utils";
import { ja } from "date-fns/locale";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Calendar } from "../@/components/ui/calendar";
import dayjs from "dayjs";

interface EditNoteModalProps {
  modalOpen: boolean;
  clickModalClose: () => void;
  note: DeleteNote;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  modalOpen,
  clickModalClose,
  note,
}) => {
  const updateNote = useUpdateNote();

  function onSubmit(values: z.infer<typeof NoteValidationShema>) {
    console.log(values);
    updateNote.mutate({ id: note.id, values: values });
    clickModalClose();
  }

  const form = useForm<Note>({
    resolver: zodResolver(NoteValidationShema),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
  });

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={clickModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4 text-center font-bold">ノートを編集する</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue={note.title}
                        placeholder="タイトル"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                defaultValue={note.content}
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
                defaultValue={note.date}
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

              <div className="flex justify-end items-center">
                <a onClick={clickModalClose}>キャンセル</a>
                <Button className="ml-3 bg-gray-600" type="submit">
                  編集する
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditNoteModal;
