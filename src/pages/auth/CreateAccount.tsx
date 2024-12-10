"use client ";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { APP_DESC, APP_LOGO } from "@/lib/constants";
import CustomInput from "@/components/CustomInput";
import { CheckmarkCircle01Icon, Loading03Icon } from "hugeicons-react";
import React, { useEffect } from "react";
import { AuthCreateAccount, ChkUsr } from "../../../api/auth/auth";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "@/redux/hooks";
import { authenticate } from "@/redux/features/auth/authSlice";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { APP_API_ENDPOINT_URL } from "../../../api/api_endpoint";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "lodash";

const authCreateAccountSchema = z.object({
  userName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters long.",
    })
    .refine((value) => !value.includes("@"), {
      message: "Username must not contain the '@' character.",
    }),
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function CreateAccount({
  setAuthenticated,
}: {
  setAuthenticated: any;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [_, setCookie] = useCookies(["token"]);
  const authDispatch = useAppDispatch();
  const navigate = useNavigate();
  const [step, setStep] = React.useState(
    Number(localStorage.getItem("createAccountStep")) || 1
  );
  const [chkUsr, setChkUsr] = React.useState<boolean | null>(null);

  const authCreateAccountForm = useForm<
    z.infer<typeof authCreateAccountSchema>
  >({
    resolver: zodResolver(authCreateAccountSchema),
    defaultValues: {
      userName: localStorage.getItem("createAccountFormValues")
        ? JSON.parse(localStorage.getItem("createAccountFormValues") || "")
            .userName
        : "",
      email: localStorage.getItem("createAccountFormValues")
        ? JSON.parse(localStorage.getItem("createAccountFormValues") || "")
            .email
        : "",
      password: localStorage.getItem("createAccountFormValues")
        ? JSON.parse(localStorage.getItem("createAccountFormValues") || "")
            .password
        : "",
    },
  });

  // Save the step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("createAccountStep", step.toString());
    authCreateAccountForm.watch((value) => {
      localStorage.setItem("createAccountFormValues", JSON.stringify(value)),
        [value];
    });
  }, [step]);

  const onCreateAccount = async (
    data: z.infer<typeof authCreateAccountSchema>
  ) => {
    setIsLoading(!isLoading);
    const response = AuthCreateAccount({
      userName: data.userName,
      email: data.email,
      password: data.password,
    })
      .then((res) => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);

        if (res) {
          localStorage.removeItem("createAccountFormValues");
          localStorage.removeItem("createAccountStep");

          const decodedToken = JSON.parse(atob(res.token.split(".")[1]));

          setCookie("token", res.token, { path: "/" });
          authDispatch(
            authenticate({
              token: res.token,
              email: decodedToken.email,
              userName: decodedToken.userName,
              userId: decodedToken.userId,
            })
          );
          setAuthenticated(true);
          navigate("/");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response.data.code === "EMAIL_ALREADY_EXISTS") {
          authCreateAccountForm.setError("email", {
            message: "Email already exists.",
          });
        }
      });

    if (!response) {
      return;
    }
  };

  useEffect(() => {
    // Define the async function to check the user
    const checkUser = async (userName: string) => {
      if (userName && userName.length >= 4) {
        try {
          const res = await ChkUsr({ userName });

          if (userName.includes("@")) {
            authCreateAccountForm.setError("userName", {
              message: "Username must not contain the '@' character.",
            });
            setChkUsr(false);
          } else if (res.message === "Username already exists") {
            authCreateAccountForm.setError("userName", {
              message: "Username already exists.",
            });
            setChkUsr(false);
          } else {
            setChkUsr(true);
            authCreateAccountForm.clearErrors("userName");
            authCreateAccountForm.formState.isValid;
          }
        } catch (error) {
          throw error;
        }
      }
    };

    const debouncedCheckUser = debounce(checkUser, 300);
    // Get the current value of userName
    const userName = authCreateAccountForm.watch("userName");
    // Call the debounced function
    debouncedCheckUser(userName);
    // Cleanup debounce on unmount or when userName changes
    return () => debouncedCheckUser.cancel();
  }, [authCreateAccountForm.watch("userName")]);

  return (
    <div className="md:px-20 grid place-items-center">
      <div className="grid place-items-center space-y-4">
        <div className="grid place-items-center">
          <img src={APP_LOGO} alt="" className="h-8 md:h-10" />
          <span className="text-muted-foreground text-sm mt-4">{APP_DESC}</span>
        </div>
        <div className="">
          <Form {...authCreateAccountForm}>
            <form className="w-full space-y-2">
              <div id="step-1" className={`${step === 1 ? "" : "hidden"}`}>
                <FormField
                  control={authCreateAccountForm.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>

                      <FormControl>
                        <CustomInput
                          {...field}
                          type="text"
                          className="w-full"
                          placeholder="Enter your username"
                          disabled={isLoading}
                          maxLength={20}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        This will be displayed on the leaderboard.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div id="step-2" className={`${step === 2 ? "" : "hidden"}`}>
                <FormField
                  control={authCreateAccountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <CustomInput
                          {...field}
                          type="email"
                          className="w-[300px]"
                          placeholder="Enter your email"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={authCreateAccountForm.control}
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
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </label>
                </div>
              </div>
              <div className="flex flex-row justify-between gap-2 items-center w-full py-3">
                {step === 2 && (
                  <Button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-fit bg-accent text-primary"
                    )}
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  className={`w-full ${!chkUsr && "cursor-not-allowed"}`}
                  disabled={
                    isLoading ||
                    !chkUsr ||
                    authCreateAccountForm.getValues("userName").length <= 3
                  }
                  {...(step === 1
                    ? { onClick: () => setStep(2) }
                    : {
                        onClick:
                          authCreateAccountForm.handleSubmit(onCreateAccount),
                      })}
                >
                  {isLoading ? (
                    <div className="flex flex-row justify-start items-center gap-2">
                      Hacking in
                      <Loading03Icon
                        className={`h-4 w-4 ${isLoading && "animate-spin"}`}
                      />
                    </div>
                  ) : (
                    <>
                      {step === 1 ? (
                        <>
                          {chkUsr !== null && chkUsr && (
                            <CheckmarkCircle01Icon className="h-4 w-4" />
                          )}{" "}
                          Next
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </>
                  )}
                </Button>
              </div>
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
            Already have an account?{" "}
            <Link to="/login" className="hover:underline text-primary">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
