import { z } from "zod";

export const signUpValidationShema = z.object({
  email: z
    .string()
    .min(1, "emailは必須です")
    .email("正しいアドレスを使用してください"),
  // grade: z.number().min(1, "学年は必須です"),
  password: z.string().min(1, "passwordは必須です"),
  // sailNo: z
  //   .string()
  //   .min(1, "セールナンバーは必須です")
  //   .regex(/^[A-Za-z0-9]+-[A-Za-z0-9]+$/, "ハイフンは必須です"),
});

export const loginValidationSchema = z.object({
  email: z
    .string()
    .min(1, "emailは必須です")
    .email("正しいアドレスを使用してください"),
  password: z.string().min(1, "passwordは必須です"),
});

export const userProfileValidationSchema = z.object({
  email: z.string().email("正しいメールアドレスを入力してください").optional(),
  name: z.string().optional(),
  gender: z.string().optional(),
  age: z.string().optional(),
  introduction: z.string().optional(),
  profile_image: z.string().optional(),
});

export const NoteValidationShema = z.object({
  title: z.string({ required_error: "タイトルを入力してください" }),
  content: z.string({ required_error: "内容を入力してください" }),
  date: z.string({ required_error: "出艇日を入力してください" }),
});

export const createQuestionValidationShema = z.object({
  content: z.string({ required_error: "質問を入力してください" }),
});

export const createAnswerValidationShema = z.object({
  content: z.string({ required_error: "回答を入力してください" }),
});

export const CalendarEventValidationShema = z.object({
  start: z.string({ required_error: "開始日を入力してください" }),
  end: z.string().optional(),
  // New fields for enhanced schedule UI
  vehicleInfo: z.string().optional(),
  repairType: z.string().optional(),
  workers: z.array(z.string()).max(3, { message: "最大3人まで選択できます" }),
  status: z.string().optional(),
  description: z.string().optional(),
  isDelayed: z.boolean().optional(),
});

