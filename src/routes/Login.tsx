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
        
        <div className="mb-8 relative group z-10">
          <div className="relative transition-all duration-500 hover:scale-105 hover:shadow-3xl" >
            <img 
              className="w-[320px] h-30 object-cover object-center transition-transform duration-700 hover:scale-110" 
              style={{ borderRadius: '10px', backdropFilter: "blur(10px)", boxShadow:"0px 0px 30px 10px #5c98eb, 0px 0px 50px 20px #5c98eb inset"}}
              src="./Logo.png" 
              alt="Logo" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-3xl"></div>
          </div>
          <div className="absolute -inset-1  from-custom-accent  rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500 -z-10"></div>
        </div>
        <div className="w-full px-9 animate-slide-up z-10">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
            <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col space-y-6">
            <div className="relative">
              <input
                className="w-full px-4 py-2 text-gray-900 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary focus:border-transparent transition-all duration-300 placeholder-gray-400 text-base font-medium hover:border-gray-300"
                id="email"
                type="email"
                placeholder="メールアドレス"
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                  {errors.email?.message as React.ReactNode}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                className="w-full px-4 py-2 text-black-900 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary focus:border-transparent transition-all duration-300 placeholder-gray-400 text-base font-medium hover:border-gray-300"
                id="password"
                type="password"
                placeholder="パスワード"
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
