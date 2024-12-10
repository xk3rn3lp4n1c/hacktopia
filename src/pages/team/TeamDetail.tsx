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
import {
  AttachmentSquareIcon,
  CrownIcon,
  Link03Icon,
  MoreHorizontalSquare01Icon,
  Share03Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  teamRanking: string;
  teamCapturedFlags: number;
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
    teamRanking: "",
    teamCapturedFlags: 0,
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
              <span>
                {teamDetails.teamName || <Skeleton className="h-4 w-32" />}
              </span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <div className="space-y-6">
          <div className="flex flex-row justify-end items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:ring-0 cursor-pointer grid place-items-center ring-0 outline-none h-10 w-10">
                <MoreHorizontalSquare01Icon size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem>
                  <AttachmentSquareIcon size={16} />
                  Copy Team Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share03Icon size={16} />
                  Report Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-full flex justify-between items-start">
            {teamDetails.teamName ? (
              <Jdenticon size="80" value={teamDetails.teamName} />
            ) : (
              <Skeleton className="h-20 w-20" />
            )}
            <div>
              {teamDetails.teamRanking ? (
                <div className="grid place-items-center gap-2">
                  <img
                    src={`/rankings/${teamDetails.teamRanking}.svg`}
                    alt=""
                    className="h-20 w-20"
                  />
                  <span className="text-muted-foreground uppercase text-sm font-bold">
                    {teamDetails.teamPoints}
                  </span>
                </div>
              ) : (
                <Skeleton className="h-20 w-20" />
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold flex flex-row justify-start items-center gap-4">
                  {teamDetails.teamName || <Skeleton className="h-8 w-32" />}{" "}
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
              </div>
              {teamDetails && currentTeamName === "" && (
                <Button variant="ghost">
                  <Link03Icon size="16" />
                  Request Join
                </Button>
              )}
            </div>
            <Separator className="my-4 bg-primary/5" />
            <div>
              <div className="flex flex-row justify-between items-center gap-2 mt-2">
                <h2 className="text-muted-foreground text-sm flex justify-start items-center gap-2">
                  <CrownIcon className="text-yellow-600" size="16" />
                  {teamDetails.teamCaptain ? (
                    <p>{teamDetails.teamCaptain}</p>
                  ) : (
                    <Skeleton className="w-24 h-4" />
                  )}
                </h2>
              </div>
              <br />
              <div className="grid grid-cols-3 gap-6">
                {teamDetails.teamId ? (
                  <div className="w-full bg-accent p-4 rounded-lg flex flex-col">
                    <span className="text-primary text-lg">
                      {teamDetails.teamMembers.length}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Player
                      {teamDetails.teamMembers.length > 1 ? "s" : ""}
                    </span>
                  </div>
                ) : (
                  <Skeleton className="w-full h-20" />
                )}

                {teamDetails.teamId ? (
                  <div className="w-full bg-accent p-4 rounded-lg flex flex-col">
                    <span className="text-primary text-lg">
                      {teamDetails.teamCapturedFlags}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Captured Flags
                    </span>
                  </div>
                ) : (
                  <Skeleton className="w-full h-20" />
                )}

                {teamDetails.teamId ? (
                  <div className="w-full bg-accent p-4 rounded-lg flex flex-col">
                    <span className="text-primary text-lg">
                      {teamDetails.teamPoints}
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

export default TeamDetail;
