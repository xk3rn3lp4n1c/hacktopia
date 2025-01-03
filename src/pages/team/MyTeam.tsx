import { useAppSelector } from "@/redux/hooks";
import { GetMyTeamDetails } from "../../../api/team/team";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { CrownIcon, Notification02Icon } from "hugeicons-react";
import Jdenticon from "react-jdenticon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MoreVertical } from "lucide-react";

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
  }, []);

  return (
    <div className="px-4 md:px-0 md:w-[65vw] h-full mx-auto py-4">
      <div>
        <div className="space-y-6">
          <div className="w-full flex justify-between items-start">
            <div>
              {teamData && teamData.team.teamRanking ? (
                <div className="grid place-items-center gap-2">
                  <img
                    src={`/rankings/${teamData.team.teamRanking}.svg`}
                    alt=""
                    className="h-20 w-20"
                  />
                  <span className="text-muted-foreground uppercase text-sm font-bold">
                    {teamData.team.teamPoints}
                  </span>
                </div>
              ) : (
                <Skeleton className="h-20 w-20" />
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex flex-row justify-start items-center gap-2"
                >
                  <Notification02Icon className="h-4 w-4" />
                  Join Requests
                  {teamData && teamData.teamRequests.length > 0 && (
                    <span className="text-background text-xs grid place-items-center h-5 w-5 bg-red-500 rounded-full">
                      {teamData.teamRequests.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuLabel>Join Requests</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div>
                  {teamData &&
                    teamData.teamRequests.map((request: any) => {
                      return (
                        <div
                          key={request.id}
                          className="flex flex-row justify-start items-center gap-4 hover:bg-accent p-2 rounded-lg"
                        >
                          <Jdenticon
                            size={32}
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
                              <DropdownMenuLabel>My Account</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Profile</DropdownMenuItem>
                              <DropdownMenuItem>Billing</DropdownMenuItem>
                              <DropdownMenuItem>Team</DropdownMenuItem>
                              <DropdownMenuItem>Subscription</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      );
                    })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-4">
            <div className="flex flex-row justify-between items-center">
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
              <br />
              <div className="grid grid-cols-3 gap-6">
                {teamData && teamData.team.teamId ? (
                  <div className="w-full bg-accent p-4 rounded-lg flex flex-col">
                    <span className="text-primary text-lg">
                      {teamData.team.teamMembers.length}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Player
                      {teamData.team.teamMembers.length > 1 ? "s" : ""}
                    </span>
                  </div>
                ) : (
                  <Skeleton className="w-full h-20" />
                )}

                {teamData && teamData.team.teamId ? (
                  <div className="w-full bg-accent p-4 rounded-lg flex flex-col">
                    <span className="text-primary text-lg">
                      {teamData.team.teamCapturedFlags}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Captured Flags
                    </span>
                  </div>
                ) : (
                  <Skeleton className="w-full h-20" />
                )}

                {teamData && teamData.team.teamId ? (
                  <div className="w-full bg-accent p-4 rounded-lg flex flex-col">
                    <span className="text-primary text-lg">
                      {teamData.team.teamPoints}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Points
                    </span>
                  </div>
                ) : (
                  <Skeleton className="w-full h-20" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
