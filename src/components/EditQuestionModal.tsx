// import { Dialog, DialogContent } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Note } from "../types/Note";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuestionValidationShema } from "../@/components/ui/validationSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../@/components/ui/form";
import { Button } from "../@/components/ui/button";
import { ShadTextarea } from "../@/components/ui/textarea";
import { WindIdQuestion, WindQuestion } from "../types/Question";
import { useUpdateQuestion } from "../queries/QuestionQuery";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../@/components/ui/dialog";

interface ModalProps {
  modalOpen: boolean;
  clickModalClose: () => void;
  question: WindIdQuestion;
}

const EditQuestionModal: React.FC<ModalProps> = ({
  modalOpen,
  clickModalClose,
  question,
}) => {
  const updateQuestion = useUpdateQuestion();

  const form = useForm<WindQuestion>({
    resolver: zodResolver(createQuestionValidationShema),
  });

  function onSubmit(values: z.infer<typeof createQuestionValidationShema>) {
    console.log(values);
    updateQuestion.mutate({ id: question.id, values: values });
    clickModalClose();
  }

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={clickModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4 text-center font-bold">質問を編集する</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField<WindQuestion>
                control={form.control}
                name="content"
                defaultValue={question.content}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ShadTextarea {...field} placeholder="内容" />
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
    </div>
  );
};

export default EditQuestionModal;
