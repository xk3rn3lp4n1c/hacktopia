import { useAppSelector } from "@/redux/hooks";
import { AcceptJoinRequest, GetMyTeamDetails } from "../../../api/team/team";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { CrownIcon, Link03Icon, Notification02Icon, Settings02Icon } from "hugeicons-react";
import Jdenticon from "react-jdenticon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { cn, socketServer } from "@/lib/utils";

const MyTeam = () => {
  const [teamData, setTeamData] = React.useState<any>();
  const { token, userId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      await GetMyTeamDetails({ userId: userId, token: token }).then((res) => {
        if (res) {
          setTeamData(res);
          console.log(res);
        }
      });
    };

    fetchData();

    socketServer.on("allTeams", () => {
      fetchData();
    });

    return () => {
      fetchData();
      socketServer.off("allTeams");
    };
  }, [socketServer]);

  const acceptRequest = async (requestId: string) => {
    await AcceptJoinRequest({
      requestId: requestId,
      token: token,
      teamCaptainUserId: userId,
    }).then((res) => {
      console.log(res);
      socketServer.emit("allTeams");
    });
  };

  return (
    <div className="px-4 md:px-0 md:w-[65vw] h-full mx-auto py-4">
      <div>
        <div className="space-y-6">
          <div className="space-y-4 w-full">
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-row justify-start items-center gap-4">
                <Jdenticon
                  size="54"
                  value={
                    teamData && teamData.team.teamName
                      ? teamData.team.teamName
                      : ""
                  }
                />
                <div>
                  <h1 className="text-2xl font-bold flex flex-row justify-start items-center gap-4">
                    {(teamData && teamData.team.teamName) || (
                      <Skeleton className="h-8 w-32" />
                    )}{" "}
                  </h1>
                  <span className="text-muted-foreground text-sm">
                    {teamData && teamData.team.teamMotto ? (
                      teamData.team.teamMotto
                    ) : (
                      <div className="space-y-2 mt-2">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-[50%] h-4" />
                      </div>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-row justify-end items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="grid place-items-center relative h-10 w-10 rounded-full"
                    >
                      <Link03Icon className="h-4 w-4" />
                      {teamData && teamData.teamRequests.length > 0 && (
                        <span className="text-background text-xs grid place-items-center h-5 w-5 bg-red-500 rounded-full absolute -top-0 -right-0">
                          {teamData.teamRequests.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    <div className="p-1 w-full">
                      <DropdownMenuLabel>Join Requests</DropdownMenuLabel>
                    </div>
                    <DropdownMenuSeparator />
                    <div>
                      {teamData && teamData.teamRequests.length > 0 ? (
                        teamData.teamRequests.map((request: any) => {
                          return (
                            <div
                              key={request.id}
                              className="flex flex-row justify-start items-center gap-4 hover:bg-accent p-2 rounded-lg"
                            >
                              <Jdenticon
                                size="24"
                                value={request.user.profiles.userName}
                              />
                              <div className="flex flex-col">
                                <span>{request.user.profiles.userName}</span>
                                <span className="text-xs capitalize">
                                  {request.createdAt}
                                </span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size={"sm"}>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() => acceptRequest(request.id)}
                                  >
                                    Accept Request
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Decline Request
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-2 p-4">
                          <span className="text-sm text-muted-foreground">No Join Requests</span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  to="/my-team/settings"
                  className={cn(buttonVariants({ variant: "ghost" }), "grid place-items-center relative h-10 w-10 rounded-full")}
                >
                  <Settings02Icon className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <Separator className="my-4 bg-primary/5" />
            <div>
              <div className="flex flex-row justify-between items-center gap-2 mt-2">
                <h2 className="text-muted-foreground text-sm flex justify-start items-center gap-2">
                  <CrownIcon className="text-yellow-600" size="16" />
                  {teamData && teamData.team.teamCaptain ? (
                    <p>{teamData.team.teamCaptain}</p>
                  ) : (
                    <Skeleton className="w-24 h-4" />
                  )}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
