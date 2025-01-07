"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { APP_LOGO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  CellsIcon,
  Flag01Icon,
  Logout03Icon,
  RankingIcon,
  UserGroupIcon,
  UserIcon,
  UserMultipleIcon,
} from "hugeicons-react";
import React, { Ref } from "react";
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
import { clearTeam } from "@/redux/features/team/teamSlice";

interface Links {
  title: string;
  to: string;
  icon: React.ReactNode;
}
const links: Links[] = [
  {
    title: "Teams",
    to: "/teams",
    icon: <UserGroupIcon className="w-4 h-4" />,
  },
  {
    title: "Events",
    to: "/events",
    icon: <CellsIcon className="w-4 h-4" />,
  },
  {
    title: "Leaderboard",
    to: "/leaderboard",
    icon: <RankingIcon className="w-4 h-4" />,
  },
];

const Navbar = React.forwardRef<HTMLElement>((props, ref) => {
  const { userName, email, token } = useAppSelector((state) => state.auth);
  const [cookies, _] = useCookies(["token"]);
  const appDispatch = useAppDispatch();

  const [_open, setOpen] = React.useState<boolean>(false);

  const sessionSignOut = async (t: string) => {
    try {
      if (cookies && cookies.token && cookies.token === t) {
        localStorage.removeItem("token");
        appDispatch(logout());
        appDispatch(clearTeam());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav ref={ref} className="sticky top-0 w-[100vw] bg-background h-fit">
      <div className="w-full bg-primary p-2 grid place-items-center text-background text-xs">
        <span className="flex gap-2">
          <Flag01Icon className="w-4 h-4" />
          Get ready for the next challenge, {userName}!
        </span>
      </div>
      <div className="md:w-[65vw] px-4 md:px-0 h-[4rem] mx-auto flex flex-row justify-between items-center">
        <Link to={"/"}>
          <img src={APP_LOGO} alt="LOGO" className="h-[1.25rem]" />
        </Link>
        <div className="flex flex-row justify-end items-center gap-4">
          <div className="w-fit h-fit flex-row justify-center items-center gap-2 hidden lg:flex">
            {links.map((link) => (
              <Link
                to={link.to}
                key={link.title}
                className={cn(buttonVariants({ variant: "ghost" }))}
                onClick={() => setOpen(false)}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </div>

          <Badge variant={"default"} className="flex flex-shrink-0 h-[2rem]">
            Ends in 3 days
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full overflow-hidden border hover:ring-2 ring-primary ring-offset-2 flex-shrink-0 p-2">
              <Jdenticon size="24" value={userName} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <div className="p-2 flex gap-2">
                <Jdenticon size="40" value={userName} />
                <div className="flex flex-col">
                  <span>{userName}</span>
                  <small>{email}</small>
                </div>
              </div>
              <DropdownMenuSeparator className="lg:hidden" />
              <DropdownMenuLabel className="lg:hidden text-xs text-muted-foreground">
                Menu
              </DropdownMenuLabel>
              <div className="lg:hidden flex flex-col justify-start items-start">
                {links.map((link) => (
                  <DropdownMenuItem asChild key={link.title}>
                    <Link
                      to={link.to}
                      key={link.title}
                      onClick={() => setOpen(false)}
                      className="w-full"
                    >
                      {link.icon}
                      {link.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Account
              </DropdownMenuLabel>
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
                  to="/team"
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
});

export default Navbar;
