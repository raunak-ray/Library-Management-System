"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { BookOpen, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { 
    register, 
    handleSubmit, 
    formState: {isSubmitting, errors} 
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit = async (data: Inputs) => {
    try {
      const res = await api.post("/auth/login", data);
      console.log(res.data);
      toast.success("Login successful");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      console.log(error);
    }
    
  };

  return (
    <div className="min-h-screen flex bg-background">
      
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />

        <div className="relative text-center px-12 flex flex-col items-center gap-4">
          <BookOpen className="h-16 w-16 text-primary" />

          <h1 className="text-4xl font-bold text-foreground">
            Join LibraryOS
          </h1>

          <p className="text-lg text-muted-foreground max-w-sm">
            Start managing your library in minutes.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                LibraryOS
              </span>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome Back
            </h2>

            <p className="text-muted-foreground">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-foreground">
                Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                disabled={isSubmitting}
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email",
                  },
                })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-foreground">
                Password
              </label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isSubmitting}
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                 })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-lg text-primary-foreground hover:opacity-80 cursor-pointer
              "
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-center mt-4 ">
          <span className="text-sm md:text-lg text-muted-foreground">
            Don&apos;t have an account?
          </span> 
          <Button variant="link" onClick={() => router.push("/signup")}
            className="cursor-pointer text-sm md:text-lg">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}