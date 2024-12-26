"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCircleHalfDotIcon, AddTeamIcon } from "hugeicons-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomInput from "@/components/CustomInput";
import { ChkTeam, CreateTeam } from "../../../api/team/team";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import { debounce } from "lodash";
import { setTeam } from "@/redux/features/team/teamSlice";

const formSchema = z.object({
  teamName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  teamCode: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  teamCaptain: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const Teams = () => {
  const { userName, token } = useAppSelector((state) => state.auth);
  const [chkTeam, setChkTeam] = React.useState(false);

  const appDispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      teamCode: "",
      teamCaptain: userName,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await CreateTeam({
      teamName: values.teamName,
      teamCode: values.teamCode,
      teamCaptain: userName,
      token: token,
    })
      .then((res) => {
        if (res.code === "TEAM_CREATED") {
          console.log(res);
          appDispatch(setTeam(res.teamName));
          setChkTeam(false);
        }
      })
      .catch((error) => {
        if (error.response.data.code === "TEAM_NOT_CREATED") {
          form.setError("teamName", {
            message: "It seems like you already have a team.",
          });
          setChkTeam(false);
        }
      });
  }

  useEffect(() => {
    // Define the async function to check the user
    const checkTeam = async (teamName: string) => {
      if (teamName && teamName.length >= 4) {
        try {
          const res = await ChkTeam({ teamName, token });

          if (res.code === "TEAM_NAME_NOT_AVAILABLE") {
            form.setError("teamName", {
              message: "Team name not available.",
            });
            setChkTeam(false);
          } else if (res.code === "TEAM_NAME_AVAILABLE") {
            form.clearErrors("teamName");
            setChkTeam(false);
          } else {
            setChkTeam(true);
            form.clearErrors("teamName");
            form.formState.isValid;
          }
        } catch (error) {
          throw error;
        }
      }
    };

    const debouncedCheckTeam = debounce(checkTeam, 300);
    const teamName = form.watch("teamName");
    debouncedCheckTeam(teamName);
    // Cleanup debounce on unmount or when userName changes
    return () => debouncedCheckTeam.cancel();
  }, [form.watch("teamName")]);

  return (
    <div className="py-4">
      <Tabs defaultValue="account">
        <TabsList className="bg-transparent flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center">
            <TabsTrigger
              value="account"
              className="px-6 py-2 shadow-none border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              All Teams
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="px-6 py-2 shadow-none border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
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
              Join Team
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"default"}
                  className="flex flex-row justify-start items-center gap-4"
                >
                  <AddCircleHalfDotIcon className="w-4 h-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[400px]">
                <DialogHeader>
                  <DialogTitle>Create Team</DialogTitle>
                  <div>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                      >
                        <FormField
                          control={form.control}
                          name="teamName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team name</FormLabel>
                              <FormControl>
                                <CustomInput
                                  {...field}
                                  type="text"
                                  className="w-full"
                                  placeholder="Enter a name for your team"
                                  maxLength={15}
                                />
                              </FormControl>
                              <FormDescription>
                                This will be displayed on your profile and in
                                the leaderboard.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="teamCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team Code</FormLabel>
                              <FormControl>
                                <CustomInput
                                  {...field}
                                  type="password"
                                  className="w-full"
                                  placeholder="Enter your team code"
                                />
                              </FormControl>
                              <FormDescription>
                                This will be use by others to join your team.
                              </FormDescription>
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
                          Create Team
                        </Button>
                      </form>
                    </Form>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </TabsList>
        <div className="py-6">
          <TabsContent value="account">なに</TabsContent>
          <TabsContent value="password">なに</TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Teams;
