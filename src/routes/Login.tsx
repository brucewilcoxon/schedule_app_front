import "../index.css";
import React from "react";
import { useForm } from "react-hook-form";
import { LoginCredentials } from "../types/user";
import { loginValidationSchema } from "../@/components/ui/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import { useLogin } from "../queries/AuthQuery";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    mode: "onChange",
    resolver: zodResolver(loginValidationSchema),
  });

  const signInMutation = useLogin();
  const navigate = useNavigate();
  
  const onsubmit = (data: LoginCredentials) => {
    console.log(data);
    signInMutation.mutate(data, {
      onSuccess: () => {
        navigate("/calendar");
      },
      onError: (error) => {
        console.error("Login error:", error);
      },
    });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-700 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(./sc.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            width: '100%'
          }}
        />
        {/* Top-left company logo with glow, shadow and subtle animation */}
        <div className="absolute top-12 left-8 z-20 group">
          <div className="absolute -inset-2 rounded-xl  opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          <img
            src="/companylogo.png"
            alt="Company Logo"
            className="relative h-14 w-auto  transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="w-full px-9 animate-slide-up z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
            <div className="flex flex-col items-left mb-14 ">
   
              <h2 className="text-xl md:text-3xl font-semibold tracking-wide">
                Login to Mrservice
              </h2>
            </div>
            <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block mb-2 text-white/95 font-semibold tracking-wide">
                メールアドレス
              </label>
              <span className="pointer-events-none absolute left-3 top-[42px] flex items-center text-gray-400">
                {/* Mail icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M1.5 8.67v6.58A3.75 3.75 0 0 0 5.25 19h13.5A3.75 3.75 0 0 0 22.5 15.25V8.67l-8.78 5.49a3.75 3.75 0 0 1-3.44 0L1.5 8.67Z"/>
                  <path d="M22.5 7.06v-.31A3.75 3.75 0 0 0 18.75 3H5.25A3.75 3.75 0 0 0 1.5 6.75v.31l9.47 5.92a2.25 2.25 0 0 0 2.06 0L22.5 7.06Z"/>
                </svg>
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border-2 rounded-sm outline-none focus:outline-none focus:ring-2 focus:ring-custom-primary focus:border-transparent transition-all duration-300 placeholder-gray-400 text-base font-medium hover:border-gray-300"
                id="email"
                type="email"
                placeholder="メールアドレスを入力してください"
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                  {errors.email?.message as React.ReactNode}
                </p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="password" className="block mb-2 text-white/95 font-semibold tracking-wide">
                パスワード
              </label>
              <span className="pointer-events-none absolute left-3 top-[42px] flex items-center text-gray-400">
                {/* Lock icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 1.5a4.5 4.5 0 0 0-4.5 4.5v3H6.75A2.25 2.25 0 0 0 4.5 11.25v7.5A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 17.25 9H16.5V6A4.5 4.5 0 0 0 12 1.5Zm-3 7.5V6a3 3 0 1 1 6 0v3H9Zm3 4.125a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75Z" clipRule="evenodd"/>
                </svg>
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 text-black-900 bg-white border-2 rounded-sm outline-none focus:outline-none focus:ring-2 focus:ring-custom-primary focus:border-transparent transition-all duration-300 placeholder-gray-400 text-base font-medium hover:border-gray-300"
                id="password"
                type="password"
                placeholder="パスワードを入力してください"
                {...register("password")}
              />
              {errors.password?.message && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                  {errors.password?.message as React.ReactNode}
                </p>
              )}
            </div>
            <div className="">
              <Button
                text={signInMutation.isLoading ? "ログイン中..." : "ログイン"}
                className={`w-full transition-all duration-500 ${
                  signInMutation.isLoading
                    ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 animate-pulse relative overflow-hidden"
                    : "bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 transform hover:scale-105"
                } text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl`}
                disabled={signInMutation.isLoading}
              >
                {signInMutation.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                )}
              </Button>
            </div>

          </form>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
