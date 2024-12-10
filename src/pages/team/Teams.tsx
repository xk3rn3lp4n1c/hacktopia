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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateTeamFormDialogComponent from "./CreateTeamFormDialogComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import JoinTeamFormDialogComponent from "./JoinTeamFormDialogComponent";
import MyTeam from "./MyTeam";

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

    return () => {
      listTeams();
      socketServer.off("allTeams");
    };
  }, [socketServer]);

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/teams">All Teams</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-1xl font-bold">Teams</h1>
          <p className="text-sm text-muted-foreground">
            Here you can see all the teams in the world
          </p>
        </div>
        <div className="flex flex-row justify-end items-center gap-2">
          <JoinTeamFormDialogComponent />
          <CreateTeamFormDialogComponent />
        </div>
      </div>
      <ScrollArea>
        <div className="space-y-4 h-full">
          {teams && teams.length > 0 ? (
            teams.map((team: any) => (
              <div
                key={team.teamName}
                className="grid grid-cols-[auto_1fr_auto_.5fr] md:grid-cols-[auto_auto_1fr_.3fr_auto_.5fr] gap-2"
              >
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={`/rankings/${team.teamRanking}.svg`}
                    alt=""
                    className="h-12 w-12"
                    title={team.teamRanking.replace("_", " ").toUpperCase()}
                  />
                </div>
                <div className="rounded-full flex-shrink-0 flex justify-center items-center w-12">
                  <Jdenticon size="40" value={team.teamName} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{team.teamName}</span>
                  <small className="text-xs text-muted-foreground font-medium">
                    {team.teamCountry}
                  </small>
                </div>
                <div className="flex-col hidden md:flex">
                  <span className="font-semibold">
                    {team.teamMembers && team.teamMembers.length} player{" "}
                    {team.teamMembers && team.teamMembers.length > 1 ? "s" : ""}
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
                        <p className="text-sm">View Team</p>
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
    </div>
  );
};

export default Teams;
