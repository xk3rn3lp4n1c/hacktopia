"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GetTeamDetails } from "../../../api/team/team";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import Jdenticon from "react-jdenticon";
import { getData } from "country-list";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CrownIcon, Link03Icon, Location01Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface TeamMemberProfile {
  userId: string;
  userName: string;
  userProfilePicture: string | null;
}

interface TeamMember {
  id: number;
  teamId: string;
  userId: string;
  userRole: string;
  userPoints: number;
  userChallengesAnswered: any[];
  joinedAt: string;
  profile: TeamMemberProfile;
}

interface TeamDetails {
  id: number;
  teamId: string;
  teamName: string;
  teamCaptain: string;
  teamMotto: string;
  teamCountry: string;
  teamPoints: number;
  createdAt: string;
  updatedAt: string;
  teamMembers: TeamMember[];
}

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const currentTeamName = useAppSelector((state) => state.team.teamName);

  const [teamDetails, setTeamDetails] = useState<TeamDetails>({
    id: 0,
    teamId: "",
    teamName: "",
    teamCaptain: "",
    teamMotto: "",
    teamCountry: "",
    teamPoints: 0,
    createdAt: "",
    updatedAt: "",
    teamMembers: [],
  });

  useEffect(() => {
    const fetchTeamDetails = async () => {
      await GetTeamDetails({
        teamId: teamId || "",
        token: token,
      })
        .then((res) => {
          if (res) {
            console.log(res.team);
            setTeamDetails(res.team);
          }
        })
        .catch(() => {
          // navigate("/teams");
        });
    };

    return () => {
      fetchTeamDetails();
    };
  }, []);

  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/teams">
                  {teamDetails.teamName ? (
                    "All Teams"
                  ) : (
                    <Skeleton className="h-4 w-12" />
                  )}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <span>
                  {teamDetails.teamName || <Skeleton className="h-4 w-32" />}
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="py-10">
          <div className="space-y-6">
            <div className="w-full flex justify-between items-start">
              {teamDetails.teamName ? (
                <Jdenticon size="80" value={teamDetails.teamName} />
              ) : (
                <Skeleton className="h-20 w-20" />
              )}
              {currentTeamName === "" && (
                <Button variant="ghost">
                  <Link03Icon size="16" />
                  Request Join
                </Button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold flex flex-row justify-start items-center gap-4">
                {teamDetails.teamName || <Skeleton className="h-8 w-32" />}{" "}
                {teamDetails.teamName ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant={"default"} className="">
                        {getData().map((country) =>
                          country.name === teamDetails.teamCountry
                            ? country.code
                            : null
                        )}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start">
                      <span className="text-xs flex flex-row justify-start items-center gap-2">
                        <Location01Icon size="14" />
                        {teamDetails.teamCountry}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Skeleton className="h-5 w-7" />
                )}
              </h1>
              <span className="text-muted-foreground text-sm">
                {teamDetails.teamMotto ? (
                  teamDetails.teamMotto
                ) : (
                  <div className="space-y-2 mt-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-[50%] h-4" />
                  </div>
                )}
              </span>
              <Separator className="my-4 bg-primary/5" />
              <div>
                <div className="flex flex-row justify-start items-center gap-2 mt-2">
                  <h2 className="text-muted-foreground text-sm flex justify-start items-center gap-2">
                    <CrownIcon size="16" />
                    {teamDetails.teamCaptain ? (
                      <p>{teamDetails.teamCaptain}</p>
                    ) : (
                      <Skeleton className="w-full h-4" />
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default TeamDetail;
