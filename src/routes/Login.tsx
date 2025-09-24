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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
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
        <div className="absolute top-8 left-4 z-20 group">
          <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-cyan-400/40 via-blue-500/30 to-blue-700/40 blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          <img
            src="/companylogo.png"
            alt="Company Logo"
            className="relative h-8 w-auto md:h-12 lg:h-14 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="w-full px-9 animate-slide-up z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
            <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col space-y-6">
            <div className="relative group">
              <input
                className="peer w-full px-4 py-4 text-gray-900 bg-white border-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-custom-primary focus:border-transparent transition-all duration-300 placeholder-transparent text-base font-medium hover:border-gray-300"
                id="email"
                type="email"
                placeholder=" "
                {...register("email")}
              />
              <label htmlFor="email" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/3 text-gray-500 transition-all duration-300 bg-transparent px-1
                group-hover:top-1 group-hover:text-xs group-hover:text-blue-600
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500">
                メールアドレスを入力してください
              </label>
              {errors.email?.message && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                  {errors.email?.message as React.ReactNode}
                </p>
              )}
            </div>
            <div className="relative group">
              <input
                className="peer w-full px-4 py-4 text-black-900 bg-white border-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-custom-primary focus:border-transparent transition-all duration-300 placeholder-transparent text-base font-medium hover:border-gray-300"
                id="password"
                type="password"
                placeholder=" "
                {...register("password")}
              />
              <label htmlFor="password" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/3 text-gray-500 transition-all duration-300 bg-transparent px-1
                group-hover:top-1 group-hover:text-xs group-hover:text-blue-600
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500">
                パスワードを入力してください
              </label>
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
