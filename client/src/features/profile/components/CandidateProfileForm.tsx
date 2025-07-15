import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { handleApiError } from "@/lib/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, MapPin, Globe, FileText, Code, Briefcase } from "lucide-react";
import { useCreateCandidateProfileMutation } from "../candidateProfileApi";
import {
  CandidateProfileFormValues,
  candidateProfileSchema,
} from "../schemas/candidateProfileSchema";
import { ResumeUpload } from "./ResumeUpload";

export function CandidateProfileForm({
  isResumeUploadShow = true,
}: {
  isResumeUploadShow?: boolean;
}) {
  const [createProfile, { isLoading }] = useCreateCandidateProfileMutation();

  const form = useForm<CandidateProfileFormValues>({
    resolver: zodResolver(
      candidateProfileSchema
    ) as Resolver<CandidateProfileFormValues>,
    defaultValues: {
      location: "",
      openToRemote: false,
      skills: "",
      experience: 0,
    },
  });

  const onSubmit = async (values: CandidateProfileFormValues) => {
    try {
      const formattedValues = {
        ...values,
        skills: values.skills.split(",").map((skill) => skill.trim()),
      };

      await createProfile(formattedValues);
      toast.success("Profile created successfully!");
      window.location.reload();
    } catch (error: any) {
      handleApiError(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 shadow-2xl overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-5" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Complete Your Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Tell us about yourself to help employers find you
              </p>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              {isResumeUploadShow && (
                <div className="space-y-2">
                  <label className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Resume
                  </label>
                  <ResumeUpload
                    onUploadSuccess={(url: string) => {
                      // Resume is now handled separately via CandidateResume model
                      toast.success("Resume uploaded successfully!");
                    }}
                  />
                </div>
              )}

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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Profile"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
