import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/hooks";
import { handleApiError } from "@/lib/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, UserCheck } from "lucide-react";
import { ProfileUpdateFormValues, profileUpdateSchema } from "../schemas";
import { useUpdateProfileMutation } from "../userApi";

export function ProfileUpdateForm() {
  const { user } = useAuth();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    });
  }, [user]);

  const onSubmit = async (values: ProfileUpdateFormValues) => {
    try {
      await updateProfile(values).unwrap();

      toast.success("Profile updated successfully");
    } catch (error: any) {
      handleApiError(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your first name" 
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
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Last Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your last name" 
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
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] mt-6" 
          disabled={isLoading}
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
      </form>
    </Form>
  );
}
