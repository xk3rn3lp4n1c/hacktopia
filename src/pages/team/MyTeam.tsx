import { useAppSelector } from "@/redux/hooks";
import { GetMyTeamDetails } from "../../../api/team/team";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import {
  CrownIcon,
} from "hugeicons-react";
import { Jdenticon } from "react-jdenticon";

const MyTeam = () => {
  const [teamData, setTeamData] = React.useState<any>();
  const { token, userId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      await GetMyTeamDetails({ userId: userId, token: token }).then(
        async (res) => {
          if (res) {
            setTeamData(res);
            console.log(res);
          }
        }
      );
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 md:px-0 md:w-[65vw] h-full mx-auto py-4">
      <div>
        <div className="space-y-6">
          <div className="w-full flex justify-between items-start">
            {teamData && teamData.team.teamName ? (
              <Jdenticon size="80" value={teamData.team.teamName} />
            ) : (
              <Skeleton className="h-20 w-20" />
            )}
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
          </div>
          <div className="space-y-4">
            <div className="flex flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold flex flex-row justify-start items-center gap-4">
                  {teamData && teamData.team.teamName || <Skeleton className="h-8 w-32" />}{" "}
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
