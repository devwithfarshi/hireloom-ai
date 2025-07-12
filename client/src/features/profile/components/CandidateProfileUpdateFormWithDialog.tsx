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
import { Dribbble, Github, Globe, Linkedin, Plus, Trash2, MapPin, FileText, Code, Briefcase } from "lucide-react";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your location" 
                  className="border-2 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="openToRemote"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Remote Work
                </FormLabel>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resume URL
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your resume URL" 
                  className="border-2 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
                  {...field} 
                />
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
              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <Code className="w-4 h-4" />
                Skills
              </FormLabel>
              <FormDescription className="text-gray-600 dark:text-gray-400">
                List your relevant skills (comma `,` separated).
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="React, TypeScript, Node.js, Python..."
                  className="border-2 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
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
              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Years of Experience
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="0"
                  className="border-2 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
                  {...field} 
                />
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
                <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Social Links
                </FormLabel>
                <FormDescription className="text-gray-600 dark:text-gray-400">
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
                                      className="border-2 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
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
                    <SelectTrigger className="border-2 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors">
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
                  className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 mt-8">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
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
