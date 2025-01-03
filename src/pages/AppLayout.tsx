"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scroll } from "lucide-react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navRef = useRef<HTMLElement>(null); // Ref for the Navbar
  const [navHeight, setNavHeight] = useState<number>(0); // State to store Navbar height

  // Effect to calculate and set the Navbar height
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden">
      <div className="grid grid-rows-[auto_1fr]">
        <Navbar ref={navRef} />
        <ScrollArea
          className="w-full"
          style={{ height: `calc(100vh - ${navHeight}px)` }}
        >
          {children}
        </ScrollArea>
      </div>
    </div>
  );
};

export default AppLayout;
