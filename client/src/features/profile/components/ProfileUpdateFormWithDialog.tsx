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
import { DialogClose } from "@/components/ui/dialog";
import { useGetMeQuery } from "@/features/auth/authApi";

export function ProfileUpdateFormWithDialog() {
  const { user } = useAuth();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { refetch } = useGetMeQuery();

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
  }, [user, form]);

  const onSubmit = async (values: ProfileUpdateFormValues) => {
    try {
      await updateProfile(values).unwrap();
      
      // Refetch user data to update the state
      await refetch();
      
      toast.success("Profile updated successfully");
      
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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