import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddTeamIcon } from "hugeicons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChkTeam, JoinTeam, ListTeams } from "../../../api/team/team";
import { cn, socketServer } from "@/lib/utils";
import { debounce } from "lodash";
import Jdenticon from "react-jdenticon";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

const formSchema = z.object({
  teamId: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
});

const JoinTeamFormDialogComponent = () => {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<any>([]);

  const { token, userId } = useAppSelector((state) => state.auth);
  const [chkTeam, setChkTeam] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await JoinTeam({
      teamId: values.teamId,
      userId: userId,
      token: token,
    })
      .then((res) => {
        if (res.code === "JOIN_REQUEST_CREATED") {
          setChkTeam(false);
          setOpen(false);
          socketServer.emit("joinTeam", {
            teamId: values.teamId,
          });
        }
      })
      .catch((error) => {
        if (error.response.data.code === "JOIN_REQUEST_NOT_CREATED") {
          form.setError("teamId", {
            message: "Join request not created",
          });
          setChkTeam(false);
        }
      });
  }

  useEffect(() => {
    const listTeams = async () => {
      await ListTeams({ token }).then((res) => {
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

  useEffect(() => {
    // Define the async function to check the user
    const checkTeam = async (teamName: string) => {
      if (teamName && teamName.length >= 4) {
        try {
          const res = await ChkTeam({ teamName, token });

          if (res.code === "TEAM_NAME_NOT_AVAILABLE") {
            form.setError("teamId", {
              message: "Team name not available.",
            });
            setChkTeam(false);
          } else if (res.code === "TEAM_NAME_AVAILABLE") {
            form.clearErrors("teamId");
            setChkTeam(false);
          } else {
            setChkTeam(true);
            form.clearErrors("teamId");
            form.formState.isValid;
          }
        } catch (error) {
          throw error;
        }
      }
    };

    const debouncedCheckTeam = debounce(checkTeam, 300);
    const teamId = form.watch("teamId");
    debouncedCheckTeam(teamId);
    // Cleanup debounce on unmount or when userName changes
    return () => debouncedCheckTeam.cancel();
  }, [form.watch("teamId")]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex flex-row justify-start items-center gap-4"
        >
          <AddTeamIcon className="w-4 h-4" />
          <span className="hidden md:block">Join Team</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[400px] h-fit">
        <DialogHeader>
          <DialogTitle>Join Team</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? teams.find(
                                  (team: any) => team.teamId === field.value
                                )?.teamName
                              : "Select team..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="md:w-[350px] min-w-max p-0"
                        align="start"
                        side="bottom"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search teams..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Team not found.</CommandEmpty>
                            <CommandGroup>
                              {teams.map((team: any) => (
                                <CommandItem
                                  value={team.teamId}
                                  key={team.teamId}
                                  onSelect={() => {
                                    form.setValue("teamId", team.teamId);
                                    console.log(team.teamId);
                                  }}
                                >
                                  <div className="grid place-items-center overflow-hidden rounded-full p-0">
                                    <Jdenticon value={team.teamName} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span>{team.teamName}</span>
                                    <small className="text-xs capitalize text-muted-foreground">
                                      {team.teamRanking}
                                    </small>
                                  </div>
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      team.teamId === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                variant={"default"}
                disabled={chkTeam}
              >
                Request Join
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinTeamFormDialogComponent;
