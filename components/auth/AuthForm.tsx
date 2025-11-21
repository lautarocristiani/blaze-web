"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithEmail, signUpWithEmail } from "@/lib/actions";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

const DEMO_CREDENTIALS = {
  EMAIL_1: "demo1@user.com",
  EMAIL_2: "demo2@user.com",
  PASSWORD: "test1234",
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Loading..." : text}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="mt-1 text-xs text-red-500">{errors[0]}</p>;
}

export function AuthForm() {
  const [loginState, loginAction] = useActionState(loginWithEmail, initialState);
  const [signupState, signupAction] = useActionState(
    signUpWithEmail,
    initialState
  );

  const [isFlipped, setIsFlipped] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const handleDemoLogin = (email: string) => {
    setLoginInput({
      email: email,
      password: DEMO_CREDENTIALS.PASSWORD,
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex items-center justify-center rounded-full bg-primary/10 p-3">
          <Flame className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome to Blaze</h1>
        <p className="text-sm text-muted-foreground">
          The best marketplace for digital goods
        </p>
      </div>

      <div className="w-full [perspective:1000px]">
        <motion.div
          className="grid w-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* LOGIN CARD */}
          <div className="w-full [grid-area:1/1] [backface-visibility:hidden]">
            <Card className="h-full justify-center">
              <CardHeader>
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Enter your credentials to log in.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col items-center">
                <div className="flex justify-between gap-2 w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 text-xs h-9 px-2"
                    onClick={() => handleDemoLogin(DEMO_CREDENTIALS.EMAIL_1)}
                  >
                    <Flame size={14} className="mr-1" /> Demo User 1
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 text-xs h-9 px-2"
                    onClick={() => handleDemoLogin(DEMO_CREDENTIALS.EMAIL_2)}
                  >
                    <Flame size={14} className="mr-1" /> Demo User 2
                  </Button>
                </div>

                <div className="relative flex justify-center w-full my-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative z-10 bg-card px-2 text-xs text-muted-foreground">
                    Or log in manually
                  </div>
                </div>
                
                <form action={loginAction} className="space-y-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email or Username</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="text"
                      placeholder="m@example.com or username"
                      value={loginInput.email}
                      onChange={(e) => setLoginInput((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <FieldError errors={loginState.errors?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginInput.password}
                        onChange={(e) => setLoginInput((prev) => ({ ...prev, password: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                        aria-label={
                          showLoginPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showLoginPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <FieldError errors={loginState.errors?.password} />
                  </div>

                  {!loginState.success &&
                    loginState.message &&
                    !loginState.errors && (
                      <p className="text-sm text-red-500">{loginState.message}</p>
                    )}

                  <SubmitButton text="Log In" />
                </form>

                <p className="pt-2 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SIGNUP CARD */}
          <div className="w-full [grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Enter your details to register.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={signupAction} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" name="firstName" />
                      <FieldError errors={signupState.errors?.firstName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" name="lastName" />
                      <FieldError errors={signupState.errors?.lastName} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" placeholder="johndoe" />
                    <FieldError errors={signupState.errors?.username} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                    />
                    <FieldError errors={signupState.errors?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input id="avatar" name="avatar" type="file" />
                    <FieldError errors={signupState.errors?.avatar} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        name="password"
                        type={showRegisterPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                        aria-label={
                          showRegisterPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showRegisterPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <FieldError errors={signupState.errors?.password} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <FieldError errors={signupState.errors?.confirmPassword} />
                  </div>

                  {!signupState.success &&
                    signupState.message &&
                    !signupState.errors && (
                      <p className="text-sm text-red-500">
                        {signupState.message}
                      </p>
                    )}

                  <SubmitButton text="Create Account" />
                </form>

                <p className="pt-2 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Log In
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}