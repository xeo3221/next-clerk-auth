"use client";

import React, { use, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";

const SignInPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (!email || !password) {
      return toast.warning("Please fill all fields");
    }
    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
        redirectUrl: "/auth-callback",
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/auth-callback");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      switch (error.errors[0]?.code) {
        case "form_identifier_not_found":
          toast.error("This email is not registered. Please sign up.");
          break;
        case "form_password_incorrect":
          toast.error("Password is incorrect. Please try again.");
          break;
        case "too_many_attempts":
          toast.error("Too many attempts. Please try again later.");
          break;
        default:
          toast.error("An error occurred. Please try again later.");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center hc gap-y-6">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleSubmit} className=" w-full max-w-sm space-y-4">
        <div className=" space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={email}
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className=" relative w-full">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1 right-1"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
        </div>
        <Button size="lg" type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <LoaderIcon className="size-5 animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
        <div className="flex">
          <p className="text-sm text-muted-foreground text-center w-full">
            You don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-foreground">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
