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
import React, { useEffect } from "react";
import { ChangePassword } from "../../../api/auth/auth";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { APP_API_ENDPOINT_URL } from "../../../api/api_endpoint";
import { cn } from "@/lib/utils";

const authResetPasswordSchema = z.object({
  newPassword: z.string().min(4).max(16, {
    message: "Password must be at least 4 characters long.",
  }),
  confirmPassword: z.string().min(4).max(16, {
    message: "Password not match",
  }),
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const resetPasswordForm = useForm<z.infer<typeof authResetPasswordSchema>>({
    resolver: zodResolver(authResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPassword = async (
    data: z.infer<typeof authResetPasswordSchema>
  ) => {
    setIsLoading(!isLoading);

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("t") || "";

    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    const response = ChangePassword({
      userId: decodedToken.userId,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    })
      .then((res) => {
        setIsLoading(false);
        if (res) {
          if (res.code === "USER_NOT_FOUND") {
            resetPasswordForm.setError("newPassword", {
              type: "custom",
              message: "User not found",
            });
          } else if (res.code === "PASSWORD_CHANGE_FAILED") {
            resetPasswordForm.setError("confirmPassword", {
              type: "custom",
              message: "Password change failed",
            });
          } else if (res.code === "PASSWORDS_DO_NOT_MATCH") {
            resetPasswordForm.setError("confirmPassword", {
              type: "custom",
              message: "Password not match",
            });
          }

          if (res.code === "PASSWORD_CHANGED_SUCCESSFULLY") {
            navigate("/login");
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);

        if (error) {
          if (error.response.data.code === "USER_NOT_FOUND") {
            resetPasswordForm.setError("newPassword", {
              type: "custom",
              message: "User not found",
            });
          } else if (error.response.data.code === "PASSWORD_CHANGE_FAILED") {
            resetPasswordForm.setError("confirmPassword", {
              type: "custom",
              message: "Password change failed",
            });
          } else if (error.response.data.code === "PASSWORDS_DO_NOT_MATCH") {
            resetPasswordForm.setError("confirmPassword", {
              type: "custom",
              message: "Password not match",
            });
          }
        }
      });
    if (!response) {
      return;
    }
  };

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("t") || "";

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="md:px-20 grid place-items-center">
      <div className="grid place-items-center space-y-4">
        <div className="grid place-items-center">
          <img src={APP_LOGO} alt="" className="h-8 md:h-10" />
          <span className="text-muted-foreground text-sm mt-4">{APP_DESC}</span>
        </div>
        <div className="">
          <Form {...resetPasswordForm}>
            <form
              onSubmit={resetPasswordForm.handleSubmit(resetPassword)}
              className="w-full space-y-2"
            >
              <FormField
                control={resetPasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <CustomInput
                        {...field}
                        type="password"
                        className="w-[300px]"
                        placeholder="Enter new password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <CustomInput
                        {...field}
                        type="password"
                        className="w-[300px]"
                        placeholder="Confirm password"
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
                    Changing Password
                    <Loading03Icon
                      className={`h-4 w-4 ${isLoading && "animate-spin"}`}
                    />
                  </div>
                ) : (
                  "Change Password"
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
