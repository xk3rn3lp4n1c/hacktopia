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
import { Loading03Icon } from "hugeicons-react";
import React, { useEffect } from "react";
import { VerifyOneTimePassword } from "../../../api/auth/auth";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { APP_API_ENDPOINT_URL } from "../../../api/api_endpoint";
import { cn } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const authResetPasswordSchema = z.object({
  otp: z.string().min(6).max(6, {
    message: "Please enter a valid OTP.",
  }),
});

export default function VerifyOTP() {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const authVerifyOTPForm = useForm<z.infer<typeof authResetPasswordSchema>>({
    resolver: zodResolver(authResetPasswordSchema),
    defaultValues: {
      otp: "",
    },
  });

  const VerifyOTPCode = async (
    data: z.infer<typeof authResetPasswordSchema>
  ) => {
    setIsLoading(!isLoading);
    const response = VerifyOneTimePassword({
      otp: data.otp,
      userId: decodedToken.userId,
    })
      .then((res) => {
        if (res) {
          if (res.code === "OTP_VERIFICATION_SUCCESSFULLY") {
            setIsLoading(false);
            navigate(`/reset-password?t=${res.token}`);
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);

        if (error) {
          if (error.response.data.code === "USER_NOT_FOUND") {
            authVerifyOTPForm.setError("otp", {
              type: "custom",
              message: "User not found",
            });
          } else if (error.response.data.code === "INVALID_OTP") {
            authVerifyOTPForm.setError("otp", {
              type: "custom",
              message: "Invalid OTP",
            });
          }
        }
      });
    if (!response) {
      return;
    }
  };

  const searchParams = new URLSearchParams(window.location.search);
  const uid = searchParams.get("uid") || "";
  const exp = searchParams.get("exp") || "";
  const token = searchParams.get("token") || "";

  const decodedToken = token && JSON.parse(atob(token.split(".")[1]));

  useEffect(() => {
    if (uid != decodedToken.userId || exp != decodedToken.exp) {
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
          <Form {...authVerifyOTPForm}>
            <form
              onSubmit={authVerifyOTPForm.handleSubmit(VerifyOTPCode)}
              className="w-full space-y-2"
            >
              <FormField
                control={authVerifyOTPForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field} className="w-[300px]">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="border" />
                          <InputOTPSlot index={1} className="border" />
                          <InputOTPSlot index={2} className="border" />
                          <InputOTPSeparator />
                          <InputOTPSlot index={3} className="border" />
                          <InputOTPSlot index={4} className="border" />
                          <InputOTPSlot index={5} className="border" />
                        </InputOTPGroup>
                      </InputOTP>
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
                  "Verify OTP"
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
