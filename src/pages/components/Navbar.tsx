"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { APP_LOGO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Flag01Icon,
  Logout03Icon,
  RankingIcon,
  UserIcon,
  UserMultipleIcon,
} from "hugeicons-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Jdenticon from "react-jdenticon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCookies } from "react-cookie";
import { logout } from "@/redux/features/auth/authSlice";

interface Links {
  title: string;
  to: string;
  icon: React.ReactNode;
}
const links: Links[] = [
  {
    title: "Challenges",
    to: "/challenges",
    icon: <Flag01Icon className="w-4 h-4" />,
  },
  {
    title: "Leaderboard",
    to: "/leaderboard",
    icon: <RankingIcon className="w-4 h-4" />,
  },
];

const Navbar = () => {
  const { userName, email, token } = useAppSelector((state) => state.auth);
  const [cookies, _] = useCookies(["token"]);
  const appDispatch = useAppDispatch();

  const sessionSignOut = async (t: string) => {
    try {
      if (cookies && cookies.token && cookies.token === t) {
        localStorage.removeItem("token");
        appDispatch(logout());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="sticky top-0 w-[100vw] shadow-sm bg-background">
      <div className="w-[65vw] h-[4rem] mx-auto flex flex-row justify-between items-center">
        <div>
          <img src={APP_LOGO} alt="LOGO" className="h-[1.25rem]" />
        </div>
        <div className="flex flex-row justify-end items-center gap-4">
          <div className="flex flex-row justify-start items-center gap-2">
            {links.map((link) => (
              <Link
                to={link.to}
                key={link.title}
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </div>
          <Badge variant={"default"} className="flex-shrink-0 h-[2rem]">
            Ends in 3 days
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full overflow-hidden border hover:ring-2 ring-primary ring-offset-2 flex-shrink-0">
              <Jdenticon size="30" value={userName} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <div className="p-2 flex gap-2">
                <Jdenticon size="40" value={userName} />
                <div className="flex flex-col">
                  <span>{userName}</span>
                  <small>{email}</small>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/my-profile"
                  className="flex flex-row justify-start items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/my-team"
                  className="flex flex-row justify-start items-center gap-2"
                >
                  <UserMultipleIcon className="w-4 h-4" />
                  My Team
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => sessionSignOut(token)}
                className="flex flex-row justify-start items-center gap-2"
              >
                <Logout03Icon className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
