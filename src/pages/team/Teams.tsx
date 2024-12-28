"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTeamIcon, ArrowRight01Icon, Flag01Icon } from "hugeicons-react";

import { Button, buttonVariants } from "@/components/ui/button";

import { ListTeams } from "../../../api/team/team";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import { cn, socketServer } from "@/lib/utils";
import Jdenticon from "react-jdenticon";
import { Link } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateTeamFormDialogComponent from "./CreateTeamFormDialogComponent";
import { ScrollArea } from "@/components/ui/scroll-area";

const Teams = () => {
  const [teams, setTeams] = React.useState([]);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const listTeams = async () => {
      await ListTeams({ token }).then((res) => {
        console.log(res);
        setTeams(res.teams);
      });
    };

    socketServer.on("allTeams", () => {
      listTeams();
    });

    listTeams();

    return () => {
      socketServer.off("allTeams");
    };
  }, [socketServer]);

  return (
    <Tabs className="" defaultValue="all-teams">
      <TabsList className="bg-transparent flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start items-center">
          <TabsTrigger
            value="all-teams"
            className="md:px-6 py-2 shadow-none border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            All Teams
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="px-6 py-2 shadow-none border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            My Team
          </TabsTrigger>
        </div>
        <div className="flex flex-row justify-end items-center gap-2">
          <Button
            variant={"ghost"}
            className="flex flex-row justify-start items-center gap-4"
          >
            <AddTeamIcon className="w-4 h-4" />
            <span className="hidden md:block">Join Team</span>
          </Button>
          <CreateTeamFormDialogComponent />
        </div>
      </TabsList>
      <div className="py-6 h-full">
        <TabsContent value="all-teams" className="h-full">
          <ScrollArea>
            <div className="space-y-4 h-full">
              {teams && teams.length > 0 ? (
                teams.map((team: any) => (
                  <div
                    key={team.teamName}
                    className="grid grid-cols-[auto_1fr_auto_.5fr] md:grid-cols-[auto_1fr_.3fr_auto_.5fr] gap-2"
                  >
                    <div className="rounded-full">
                      <Jdenticon size="40" value={team.teamName} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{team.teamName}</span>
                      <small className="text-xs uppercase text-muted-foreground font-medium">
                        {team.teamCountry}
                      </small>
                    </div>
                    <div className="flex-col hidden md:flex">
                      <span className="font-semibold">
                        {team.teamMembers && team.teamMembers.length} player{" "}
                        {team.teamMembers && team.teamMembers.length > 1
                          ? "s"
                          : ""}
                      </span>
                      <small className="text-xs uppercase text-muted-foreground font-medium">
                        members
                      </small>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{team.teamPoints}</span>
                      <small className="text-xs uppercase text-muted-foreground font-medium text-nowrap">
                        total points
                      </small>
                    </div>
                    <div className="flex justify-end items-center">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link
                              to={`/teams/overview/${team.teamId}`}
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "rounded-full w-10 h-10"
                              )}
                            >
                              <ArrowRight01Icon className="w-4 h-4" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="center">
                            <p>View Team</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col justify-center items-center h-fit">
                  <Flag01Icon className="w-8 h-8 text-red-500 mb-2" />
                  <span className="text-muted-foreground text-sm">
                    There's no teams yet.
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="password">なに</TabsContent>
      </div>
    </Tabs>
  );
};

export default Teams;
