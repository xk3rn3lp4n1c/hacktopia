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
import { Link03Icon, Location01Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";

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
  teamCode: string;
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
    teamCode: "",
    teamCaptain: "",
    teamMotto: "",
    teamCountry: "",
    teamPoints: 0,
    createdAt: "",
    updatedAt: "",
    teamMembers: [],
  });

  useEffect(() => {
    console.log(teamId);
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
          navigate("/teams");
        });
    };

    fetchTeamDetails();
  }, []);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/teams">All Teams</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <span>{teamDetails.teamName}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="py-10">
        <div className="space-y-6">
          <div className="w-full flex justify-between items-start">
            <Jdenticon size="80" value={teamDetails.teamName} />
            {currentTeamName === "" && <Button variant="ghost">
              <Link03Icon size="16" />
              Request Join
            </Button>}
          </div>
          <h1 className="text-2xl font-bold flex flex-row justify-start items-center gap-4">
            {teamDetails.teamName}{" "}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge>
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
            </TooltipProvider>
          </h1>
          <span className="text-muted-foreground text-sm">
            {teamDetails.teamMotto}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
