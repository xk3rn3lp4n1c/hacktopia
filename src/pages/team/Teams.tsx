"use client";

import { ArrowRight01Icon, Flag01Icon } from "hugeicons-react";

import { buttonVariants } from "@/components/ui/button";

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
} from "@/components/ui/breadcrumb";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateTeamFormDialogComponent from "./CreateTeamFormDialogComponent";
import JoinTeamFormDialogComponent from "./JoinTeamFormDialogComponent";

const Teams = () => {
  const [teams, setTeams] = React.useState([]);
  const { token } = useAppSelector((state) => state.auth);
  const teamName = useAppSelector((state) => state.team.teamName);

  useEffect(() => {
    const listTeams = async () => {
      await ListTeams({ token }).then((res) => {
        setTeams(res.teams);
      });
    };

    socketServer.on("newTeamAdded", () => {
      listTeams();
    });

    return () => {
      listTeams();
      socketServer.off("newTeamAdded");
    };
  }, [socketServer]);

  return (
    <div className="relative">
      <div className="sticky top-0 space-y-4 py-4 bg-background">
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
          {teamName === "" && (
            <div className="flex flex-row justify-end items-center gap-2">
              <JoinTeamFormDialogComponent />
              <CreateTeamFormDialogComponent />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4 h-full">
        {teams && teams.length > 0 ? (
          teams.map((team: any) => (
            <div
              key={team.teamName}
              className="grid grid-cols-[auto_1fr_.5fr] md:grid-cols-[auto_auto_1fr_.3fr_.5fr_auto] gap-4"
            >
              <div className="flex-col justify-center items-center hidden md:flex">
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
              <div className="flex-col hidden md:flex text-nowrap">
                <span className="font-semibold">
                  {team.teamMembers && team.teamMembers.length} player
                  {team.teamMembers && team.teamMembers.length > 1 ? "s" : ""}
                </span>
                <small className="text-xs uppercase text-muted-foreground font-medium">
                  members
                </small>
              </div>
              <div className="hidden md:flex flex-col justify-center items-end">
                <span className="font-semibold">{team.teamPoints}</span>
                <small className="text-xs uppercase text-muted-foreground font-medium text-nowrap">
                  points
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
          <div className="flex flex-col justify-center items-center h-fit py-20">
            <Flag01Icon className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-muted-foreground text-sm">
              There's no teams yet.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
