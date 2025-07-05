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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/features/auth/hooks";
import { handleApiError } from "@/lib/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateCandidateProfileMutation } from "../candidateProfileApi";
import {
  CandidateProfileFormValues,
  candidateProfileSchema,
} from "../schemas/candidateProfileSchema";
import { useEffect } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { useGetMeQuery } from "@/features/auth/authApi";

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
    },
  });

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
    });
  }, [user, form]);

  const onSubmit = async (values: CandidateProfileFormValues) => {
    try {
      // Format skills from comma-separated string to array
      const formattedValues = {
        ...values,
        skills: values.skills.split(",").map((skill) => skill.trim()),
      };

      await updateProfile(formattedValues).unwrap();
      
      // Refetch user data to update the state
      await refetch();
      
      toast.success("Candidate profile updated successfully");
      
      // Find and click the DialogClose button to close the dialog
      const closeButton = document.querySelector('[data-dialog-close]');
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }
    } catch (error: any) {
      handleApiError(error);
    }
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