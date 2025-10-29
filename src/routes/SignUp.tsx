import "../index.css";
import React from "react";
import { useForm } from "react-hook-form";
import { LoginCredentials } from "../types/user";
import { signUpValidationShema } from "../@/components/ui/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import { useSignUp } from "../queries/AuthQuery";
import { z } from "zod";
import Layout from "../components/Layout";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    mode: "onChange",
    resolver: zodResolver(signUpValidationShema),
  });

  const signUpMutation = useSignUp();

  const onsubmit = (data: LoginCredentials) => {
    signUpMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-5 text-2xl">Windapへようこそ！</p>

        <div className="mb-5">
          <img className="mx-auto h-40" src="./windapLogo.png" alt="" />
        </div>
        <div className="w-full px-9">
          <form onSubmit={handleSubmit(onsubmit)} className="">
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 text-gray-700 leading-tight focus:outline-none focus:border-black"
                id="email"
                type="email"
                placeholder="email"
                {...register("email")}
              />
              <p className=" text-red-700">
                {errors.email?.message as React.ReactNode}
              </p>
            </div>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 text-gray-700  leading-tight focus:outline-none focus:border-black"
                id="password"
                type="password"
                placeholder="password"
                {...register("password")}
              />
              <p className=" text-red-700">
                {errors.password?.message as React.ReactNode}
              </p>
            </div>
            <div className="">
              <Button
                text="新規登録"
                className=" bg-gray-600 text-white w-full"
              />
            </div>
            <div className="flex justify-center mt-2">
              <a className=" text-sm hover:text-gray-300" href="login">
                ログインはこちら
              </a>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
