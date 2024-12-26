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
import { APP_DESC, APP_LOGO } from "@/lib/constants";
import CustomInput from "@/components/CustomInput";
import { Loading03Icon } from "hugeicons-react";
import React from "react";
import { AuthForgotPassword } from "../../../api/auth/auth";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { APP_API_ENDPOINT_URL } from "../../../api/api_endpoint";
import { cn } from "@/lib/utils";

const authForgotPasswordSchema = z.object({
  email: z.string().min(2, {
    message: "Email is required.",
  }),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const authForgotPasswordForm = useForm<
    z.infer<typeof authForgotPasswordSchema>
  >({
    resolver: zodResolver(authForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onOTPSend = async (data: z.infer<typeof authForgotPasswordSchema>) => {
    setIsLoading(!isLoading);
    const response = AuthForgotPassword({
      email: data.email,
    })
      .then((res) => {
        if (res) {
          if (res.code === "OTP_SENT_SUCCESSFULLY") {
            authForgotPasswordForm.clearErrors("email");

            const decodedToken = JSON.parse(atob(res.token.split(".")[1]));

            setIsLoading(false);
            navigate(
              `/verify-otp?uid=${decodedToken.userId}&exp=${decodedToken.exp}&token=${res.token}`
            );
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);

        if (error) {
          if (error.response.data.code === "USER_NOT_FOUND") {
            authForgotPasswordForm.setError("email", {
              type: "custom",
              message: "Email not found",
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
          <img src={APP_LOGO} alt="" className="h-8 md:h-10" />
          <span className="text-muted-foreground text-sm mt-4">{APP_DESC}</span>
        </div>
        <div className="">
          <Form {...authForgotPasswordForm}>
            <form
              onSubmit={authForgotPasswordForm.handleSubmit(onOTPSend)}
              className="w-full space-y-2"
            >
              <FormField
                control={authForgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <CustomInput
                        {...field}
                        type="email"
                        className="w-[300px]"
                        placeholder="Email associated with your account"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full btn-custom"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex flex-row justify-start items-center gap-2">
                    Verifying
                    <Loading03Icon
                      className={`h-4 w-4 ${isLoading && "animate-spin"}`}
                    />
                  </div>
                ) : (
                  "Send OTP"
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
          <span className="text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="hover:underline text-primary">
              Create one
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
