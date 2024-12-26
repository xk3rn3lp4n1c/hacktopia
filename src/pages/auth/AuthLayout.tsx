"use client";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[100vw] h-[100vh] grid md:grid-rows-[1fr_auto]">
      <div className="w-full h-full grid md:grid-cols-[1fr_.5fr]">
        <div className="hidden md:grid place-items-center w-full h-full bg-accent bg-[url('/bg.svg')]">
          <img src={"/get-ready-ctf.svg"} alt="" className="w-[80%]" />
        </div>
        {children}
      </div>
    </div>
  );
}
