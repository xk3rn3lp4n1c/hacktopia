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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AddCircleHalfDotIcon,
  ArrowUp01Icon,
  Tick02Icon,
} from "hugeicons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChkTeam, CreateTeam } from "../../../api/team/team";
import { setTeam } from "@/redux/features/team/teamSlice";
import { cn, socketServer } from "@/lib/utils";
import { debounce } from "lodash";
import { Textarea } from "@/components/ui/textarea";

import { getData } from "country-list";

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
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  teamName: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  teamMotto: z.string().min(2, {
    message: "Team motto must be at least 2 characters.",
  }),
  teamCountry: z.string().min(2, {
    message: "Team country must be at least 2 characters.",
  }),
  teamCaptain: z.string().min(2, {
    message: "Team captain must be at least 2 characters.",
  }),
});

const CreateTeamFormDialogComponent = () => {
  const [open, setOpen] = useState(false);
  const [hasCountryPicked, setHasCountryPicked] = useState(false);

  const { userName, token } = useAppSelector((state) => state.auth);
  const [chkTeam, setChkTeam] = useState(false);
  const appDispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      teamMotto: "",
      teamCountry: "",
      teamCaptain: userName,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await CreateTeam({
      teamName: values.teamName,
      teamCaptain: userName,
      teamMotto: values.teamMotto,
      teamCountry: values.teamCountry,
      token: token,
    })
      .then((res) => {
        if (res.code === "TEAM_CREATED") {
          console.log(res);
          appDispatch(setTeam(res.team.teamName));
          setChkTeam(false);

          socketServer.emit("allTeams");

          setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          className="flex flex-row justify-start items-center gap-4"
        >
          <AddCircleHalfDotIcon className="w-4 h-4" />
          <span className="hidden md:block">Create Team</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[400px] h-fit">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid grid-cols-[1fr_auto] gap-2">
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
                        This will be displayed on your profile and in the
                        leaderboard.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Team Country</FormLabel>
                      <br />
                      <Popover
                        onOpenChange={setHasCountryPicked}
                        open={hasCountryPicked ? true : false}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between p-5",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? getData().find(
                                    (country) => country.name === field.value
                                  )?.code
                                : "Country"}
                              <ArrowUp01Icon className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0"
                          side="bottom"
                          align="end"
                        >
                          <Command>
                            <CommandInput
                              placeholder="Search country..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>Country not found.</CommandEmpty>
                              <CommandGroup>
                                <ScrollArea className="max-h-[200px]">
                                  {getData().map((country) => (
                                    <CommandItem
                                      value={country.name}
                                      key={country.name}
                                      onSelect={() => {
                                        console.log(country.name);
                                        form.setValue(
                                          "teamCountry",
                                          country.name
                                        );
                                        setHasCountryPicked(true);
                                      }}
                                    >
                                      <span className="text-muted-foreground">
                                        {country.code}
                                      </span>{" "}
                                      - {country.name}
                                      <Tick02Icon
                                        className={cn(
                                          "ml-auto",
                                          country.code === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="teamMotto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team name</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="w-full"
                        placeholder="Enter team motto"
                        maxLength={200}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on your profile and in the
                      leaderboard.
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamFormDialogComponent;
