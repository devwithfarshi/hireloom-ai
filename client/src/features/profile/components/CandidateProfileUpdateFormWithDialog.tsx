import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useGetMeQuery } from "@/features/auth/authApi";
import { useAuth } from "@/features/auth/hooks";
import { handleApiError } from "@/lib/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dribbble, Github, Globe, Linkedin, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateCandidateProfileMutation } from "../candidateProfileApi";
import {
  CandidateProfileFormValues,
  candidateProfileSchema,
} from "../schemas/candidateProfileSchema";

export function CandidateProfileUpdateFormWithDialog() {
  const { user } = useAuth();
  const [updateProfile, { isLoading }] = useUpdateCandidateProfileMutation();
  const { refetch } = useGetMeQuery();

  const form = useForm<CandidateProfileFormValues>({
    resolver: zodResolver(
      candidateProfileSchema
    ) as Resolver<CandidateProfileFormValues>,
    defaultValues: {
      location: "",
      openToRemote: false,
      resumeUrl: "",
      skills: "",
      experience: 0,
      socialLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

  const platformOptions = [
    {
      value: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
    },
    { value: "github", label: "GitHub", icon: <Github className="h-4 w-4" /> },
    {
      value: "behance",
      label: "Behance",
      icon: <Dribbble className="h-4 w-4" />,
    },
    { value: "other", label: "Other", icon: <Globe className="h-4 w-4" /> },
  ];

  const getPlatformIcon = (platform: string) => {
    const option = platformOptions.find(
      (opt) => opt.value === platform.toLowerCase()
    );
    return option?.icon || <Globe className="h-4 w-4" />;
  };

  useEffect(() => {
    if (!user?.candidateProfile) return;

    // Format skills array back to comma-separated string for the form
    const skillsString = user.candidateProfile.skills?.join(", ") || "";

    form.reset({
      location: user.candidateProfile.location || "",
      openToRemote: user.candidateProfile.openToRemote || false,
      resumeUrl: user.candidateProfile.resumeUrl || "",
      skills: skillsString,
      experience: user.candidateProfile.experience || 0,
      socialLinks: user.candidateProfile.socialLinks || [],
    });
  }, [user, form]);

  const onSubmit = async (values: CandidateProfileFormValues) => {
    try {
      if (!user?.candidateProfile?.id) {
        toast.error("Candidate profile ID not found");
        return;
      }

      // Format skills from comma-separated string to array
      const formattedValues = {
        id: user.candidateProfile.id,
        ...values,
        skills: values.skills.split(",").map((skill) => skill.trim()),
        socialLinks: values.socialLinks || [],
      };

      await updateProfile(formattedValues).unwrap();

      // Refetch user data to update the state
      await refetch();

      toast.success("Candidate profile updated successfully");

      // Find and click the DialogClose button to close the dialog
      const closeButton = document.querySelector("[data-dialog-close]");
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleAddSocialLink = () => {
    if (!selectedPlatform) return;

    append({ platform: selectedPlatform, url: "" });
    setSelectedPlatform("");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter your location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="openToRemote"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Remote Work</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Are you open to remote work opportunities?
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resumeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter your resume URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormDescription>
                List your relevant skills (comma `,` separated).
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="Enter your skills (comma separated)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="socialLinks"
          render={() => (
            <FormItem className="space-y-4">
              <div>
                <FormLabel>Social Links</FormLabel>
                <FormDescription>
                  Add links to your professional profiles
                </FormDescription>
              </div>

              {fields.length > 0 && (
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {getPlatformIcon(field.platform)}
                          </div>
                          <div className="flex-grow">
                            <FormField
                              control={form.control}
                              name={`socialLinks.${index}.url`}
                              render={({ field }) => (
                                <FormItem className="flex-grow">
                                  <FormControl>
                                    <Input
                                      placeholder={`Enter your ${form.getValues(`socialLinks.${index}.platform`)} URL`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Select
                    value={selectedPlatform}
                    onValueChange={setSelectedPlatform}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSocialLink}
                  disabled={!selectedPlatform}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-between mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
