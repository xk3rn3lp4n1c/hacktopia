"use client";
import React, { forwardRef } from "react";
import { Button } from "./ui/button";
import { EyeIcon, ViewOffIcon } from "hugeicons-react";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CustomInput = forwardRef<
  HTMLDivElement,
  {
    type?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    maxLength?: number;
  } & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      type = "text",
      placeholder = "Placeholder",
      className = "",
      disabled = false,
      maxLength = 255,
      ...props
    },
    ref
  ) => {
    const [inputTypePassword, setInputTypePassword] =
      React.useState<boolean>(true);

    return (
      <div
        ref={ref}
        className={`${className} border flex flex-row justify-start items-center focus-within:ring-[2px] focus-within:ring-offset-2 ring-primary rounded-lg`}
      >
        <Input
          {...props}
          disabled={disabled}
          placeholder={placeholder}
          type={type === "password" && inputTypePassword ? "password" : "text"}
          className="border-0 shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 ring-none"
          maxLength={maxLength}
        />
        {type === "password" && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="outline-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 ring-0"
                  type="button"
                  onClick={() => setInputTypePassword(!inputTypePassword)}
                >
                  {!inputTypePassword ? <EyeIcon /> : <ViewOffIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span className="text-xs capitalize">
                  {inputTypePassword ? "show" : "hide"}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
