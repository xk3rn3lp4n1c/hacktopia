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
  teamPoints: number;
  createdAt: string;
  updatedAt: string;
  teamMembers: TeamMember[];
}

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  const [teamDetails, setTeamDetails] = useState<TeamDetails>({
    id: 0,
    teamId: "",
    teamName: "",
    teamCode: "",
    teamCaptain: "",
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
          <div className="w-fit h-fit rounded-full overflow-hidden border ring-2 ring-primary ring-offset-background ring-offset-4">
            <Jdenticon size="80" value={teamDetails.teamName} />
          </div>
          <h1 className="text-2xl font-bold">
            {teamDetails.teamName}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
