import React, { useState } from "react";
import { useUpdateAnswer } from "../queries/AnswerQuery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAnswerValidationShema } from "../@/components/ui/validationSchema";
import { Input } from "../@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../@/components/ui/dialog";
import { Button } from "../@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../@/components/ui/form";
import { ShadTextarea } from "../@/components/ui/textarea";
import { WindAnswer, WindIdAnswer } from "../types/Question";
import { z } from "zod";

interface EditAnswewrModalProps {
  modalOpen: boolean;
  clickModalClose: () => void;
  answer: WindIdAnswer;
}

const EditAnswerModal: React.FC<EditAnswewrModalProps> = ({
  modalOpen,
  clickModalClose,
  answer,
}) => {
  const updateAnswer = useUpdateAnswer();
  const form = useForm<WindAnswer>({
    resolver: zodResolver(createAnswerValidationShema),
    defaultValues: {
      content: answer.content,
    },
  });

  function onSubmit(values: z.infer<typeof createAnswerValidationShema>) {
    console.log(values);
    updateAnswer.mutate({ id: answer.id, values: values });
    clickModalClose();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={clickModalClose}>
              <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4 text-center font-bold">質問を編集する</DialogTitle>
          </DialogHeader>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField<WindAnswer>
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ShadTextarea
                      defaultValue={answer.content}
                      {...field}
                      placeholder="質問"
                    />
                  </FormControl>
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
  );
};

export default EditAnswerModal;
