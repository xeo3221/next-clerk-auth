"use client";

import React, { use, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
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

const SignUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (!name || !email || !password) {
      return toast.warning("Please fill all fields");
    }
    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerified(true);
      await signUp.update({
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
      });
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      switch (error.errors[0]?.code) {
        case "form_identifier_exists":
          toast.error("Email is already registered. Please sign in.");
          break;
        case "form_password_pwned":
          toast.error(
            "Password is too common. Please choose a stronger password."
          );
          break;
        case "form_param_format_invalid":
          toast.error(
            "Invalid email address. Please enter a valid email address."
          );
          break;
        case "form_password_length_too_short":
          toast.error("Password is to short. Please choose a longer password.");
          break;
        default:
          toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!code) return toast.warning("Please enter the verification code");

    setIsVerified(true);

    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp?.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/auth-callback");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error: any) {
      console.error("Error", JSON.stringify(error, null, 2));
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsVerified(false);
    }
  };

  return verified ? (
    <div className="flex flex-col items-center justify-center hc gap-y-6 max-w-sm mx-auto text-center">
      <div className=" w-full">
        <h1 className="text-2xl text-center font-bold">
          Please check your email
        </h1>
        <p className=" text-sm text-muted-foreground mt-2">
          We have sent a verification code to your {email}.
        </p>
      </div>

      <form onSubmit={handleVerify} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Verification code</Label>
          <InputOTP
            id="code"
            maxLength={6}
            value={code}
            disabled={isVerified}
            onChange={(e) => setCode(e)}
            className="pt-2"
          >
            <InputOTPGroup className=" justify-center w-full">
              <InputOTPSlot index={0}></InputOTPSlot>
              <InputOTPSlot index={1}></InputOTPSlot>
              <InputOTPSlot index={2}></InputOTPSlot>
              <InputOTPSlot index={3}></InputOTPSlot>
              <InputOTPSlot index={4}></InputOTPSlot>
              <InputOTPSlot index={5}></InputOTPSlot>
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          size="lg"
          type="submit"
          className="w-full"
          disabled={isVerified}
        >
          {isVerified ? (
            <LoaderIcon className="size-5 animate-spin" />
          ) : (
            "Verify"
          )}
        </Button>
        <div className="flex">
          <p className="text-sm text-muted-foreground text-center w-full">
            Back to sign up?{" "}
            <Button
              size="sm"
              variant="link"
              type="button"
              disabled={isVerified}
              onClick={() => setVerified(false)}
            >
              Sign up
            </Button>
          </p>
        </div>
      </form>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center hc gap-y-6 ">
      <h1 className="text-2xl text-center font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={name}
            disabled={isLoading}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
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
            "Sign Up"
          )}
        </Button>
        <div className="flex">
          <p className="text-sm text-muted-foreground text-center w-full">
            Already a member?{" "}
            <Link href="/sign-in" className="text-foreground">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
