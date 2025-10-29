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
      <div className="flex flex-col items-center justify-center h-screen relative">
        {/* Background Image */}
        <div 
          className="absolute bg-cover bg-center bg-no-repeat filter blur-sm"
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
        
        {/* Main content container */}
        <div className="relative z-10 flex flex-col items-center mt-20 justify-center w-[80%] max-w-md px-8 bg-black/30 backdrop-blur-lg rounded-xl py-8">
          {/* Welcome text */}
          <div className="text-left mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">ログイン</h1>
            <p className="text-sm text-white/70">システムにログインして、スケジュール管理を開始してください。</p>
          </div>

          {/* Login form */}
          <div className="w-full">
            <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col space-y-4">
              {/* Email input */}
              <div className="relative">
                <input
                  className="w-full pl-4 pr-12 py-3 text-white bg-transparent border border-white/40 rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-transparent transition-all duration-300 placeholder-white/70 text-left"
                  style={{ fontSize: '16px' }}
                  id="email"
                  type="email"
                  placeholder="ユーザー名"
                  {...register("email")}
                />
                <div className="absolute right-3 top-1/3 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white/70">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd"/>
                  </svg>
                </div>
                {errors.email?.message && (
                  <p className="mt-2 text-sm text-red-500 font-medium text-left">
                    {errors.email?.message as React.ReactNode}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="relative">
                <input
                  className="w-full pl-4 pr-12 py-3 text-white bg-transparent border border-white/40 rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-transparent transition-all duration-300 placeholder-white/70 text-left"
                  style={{ fontSize: '16px' }}
                  id="password"
                  type="password"
                  placeholder="パスワード"
                  {...register("password")}
                />
                <div className="absolute right-3 top-1/3 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white/70">
                    <path fillRule="evenodd" d="M12 1.5a4.5 4.5 0 0 0-4.5 4.5v3H6.75A2.25 2.25 0 0 0 4.5 11.25v7.5A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 17.25 9H16.5V6A4.5 4.5 0 0 0 12 1.5Zm-3 7.5V6a3 3 0 1 1 6 0v3H9Zm3 4.125a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75Z" clipRule="evenodd"/>
                  </svg>
                </div>
                {errors.password?.message && (
                  <p className="mt-2 text-sm text-red-500 font-medium text-left">
                    {errors.password?.message as React.ReactNode}
                  </p>
                )}
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-green-500 bg-transparent border-white/40 rounded focus:ring-green-500 focus:ring-2"
                />
                <label htmlFor="remember" className="text-sm text-white">
                  ログイン状態を保持
                </label>
              </div>

              {/* Login button */}
              <div className="pt-2">
                <Button
                  text={signInMutation.isLoading ? "ログイン中..." : "ログイン"}
                  className={`w-full transition-all duration-300 rounded-lg ${
                    signInMutation.isLoading
                      ? "bg-gradient-to-r from-green-300 via-green-500 to-green-600 animate-pulse relative overflow-hidden"
                      : "bg-gradient-to-r from-green-300 via-green-500 to-green-600 hover:from-green-300 hover:via-green-400 hover:to-green-500 transform hover:scale-105"
                  } text-white font-bold py-3 px-6 shadow-lg hover:shadow-xl`}
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
