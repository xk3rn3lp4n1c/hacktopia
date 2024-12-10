import { useAppSelector } from "@/redux/hooks";
import { GetMyTeamDetails } from "../../../api/team/team";
import React, { useEffect } from "react";

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
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-1xl font-bold mb-4">
          {teamData && teamData.team.teamName}
        </h1>
        <p>{teamData && teamData.teamRequests.length}</p>
      </div>
    </div>
  );
};

export default MyTeam;
