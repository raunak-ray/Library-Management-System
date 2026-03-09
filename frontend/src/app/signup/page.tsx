"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    console.log(data);
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
              Create account
            </h2>

            <p className="text-muted-foreground">
              Get started with LibraryOS
            </p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-foreground">
                Name
              </label>

              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name", { required: true })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-foreground">
                Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                {...register("email", { required: true })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
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
                {...register("password", { required: true, minLength: 8 })}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-lg text-primary-foreground hover:opacity-80 cursor-pointer"
            >
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}