"use client ";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { APP_DESC, APP_LOGO, APP_NAME } from "@/lib/constants";
import CustomInput from "@/components/CustomInput";
import { ArrowRight04Icon, Loading03Icon } from "hugeicons-react";
import React from "react";
import { AuthLogin } from "../../../api/auth/auth";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "@/redux/hooks";
import { authenticate } from "@/redux/features/auth/authSlice";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { APP_API_ENDPOINT_URL } from "../../../api/api_endpoint";
import { cn } from "@/lib/utils";

const authLoginSchema = z.object({
  email_or_username: z.string().min(2, {
    message: "Email or username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function Login({ setAuthenticated }: { setAuthenticated: any }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [_, setCookie] = useCookies(["token"]);
  const authDispatch = useAppDispatch();
  const navigate = useNavigate();

  const authLoginForm = useForm<z.infer<typeof authLoginSchema>>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email_or_username: "",
      password: "",
    },
  });

  const onLogin = async (data: z.infer<typeof authLoginSchema>) => {
    setIsLoading(!isLoading);
    const response = AuthLogin({
      email_or_username: data.email_or_username,
      password: data.password,
    })
      .then((res) => {
        if (res) {
          const decodedToken = JSON.parse(atob(res.token.split(".")[1]));

          setCookie("token", res.token, { path: "/" });
          authDispatch(
            authenticate({
              token: res.token,
              email: decodedToken.email,
              userName: decodedToken.userName,
            })
          );
          setAuthenticated(true);
          navigate("/");
        }
      })
      .catch((error) => {
        setIsLoading(false);

        if (error) {
          if (error.response.data.code === "INCORRECT_PASSWORD") {
            authLoginForm.setError("password", {
              type: "custom",
              message: "Password is incorrect",
            });
          } else if (error.response.data.code === "USER_NOT_FOUND") {
            authLoginForm.setError("email_or_username", {
              type: "custom",
              message: "User not found",
            });
          }
        }
      });
    if (!response) {
      return;
    }
  };

  return (
    <div className="md:px-20 grid place-items-center">
      <div className="grid place-items-center space-y-4">
        <div className="grid place-items-center">
          <img src={APP_LOGO} alt="" className="h-10" />
          <span className="text-muted-foreground text-sm mt-4">{APP_DESC}</span>
        </div>
        <div className="">
          <Form {...authLoginForm}>
            <form
              onSubmit={authLoginForm.handleSubmit(onLogin)}
              className="w-full space-y-2"
            >
              <FormField
                control={authLoginForm.control}
                name="email_or_username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <CustomInput
                        {...field}
                        type="text"
                        className="w-full"
                        placeholder="Enter your username or email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={authLoginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <CustomInput
                        {...field}
                        type="password"
                        className="w-[300px]"
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm hover:underline hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full btn-custom"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex flex-row justify-start items-center gap-2">
                    Hacking In
                    <Loading03Icon
                      className={`h-4 w-4 ${isLoading && "animate-spin"}`}
                    />
                  </div>
                ) : (
                  "Hack In"
                )}
              </Button>
              <div className="flex flex-row justify-between items-center w-full py-3">
                <Separator className="w-[40%]" />
                <span className="text-muted-foreground text-sm">OR</span>
                <Separator className="w-[40%]" />
              </div>
              <Link
                to={`${APP_API_ENDPOINT_URL}/api/v1/auth/google/`}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full btn-custom"
                )}
              >
                <img src="/Google__G__logo.svg" alt="" className="w-5 h-5" />
                <span className="ml-2">Sign in with Google</span>
              </Link>
            </form>
          </Form>
        </div>
        <div>
          <span className="text-sm flex flex-row justify-start items-center gap-4">
            New to {APP_NAME}?
            <Link
              to="/register"
              className="hover:underline text-primary flex flex-row justify-start items-center gap-2 flex-shrink-0"
            >
              Create one <ArrowRight04Icon className="h-4 w-4" />
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
