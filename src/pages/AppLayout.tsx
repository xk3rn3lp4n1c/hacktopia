"use client";

import React from "react";
import Navbar from "./components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden">
      <ScrollArea className="grid grid-rows-[auto_1fr] w-[100vw] h-[100vh]">
        <Navbar />
        <main>{children}</main>
      </ScrollArea>
    </div>
  );
};

export default AppLayout;
