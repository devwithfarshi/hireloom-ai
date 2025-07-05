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
import { useAuth } from "@/features/auth/hooks";
import { handleApiError } from "@/lib/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateCompanyMutation } from "@/features/company/companyApi";
import {
  CompanyProfileFormValues,
  companyProfileSchema,
  companySizeOptions,
} from "../schemas/companyProfileSchema";
import { useEffect } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { useGetMeQuery } from "@/features/auth/authApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CompanyProfileUpdateFormWithDialog() {
  const { user } = useAuth();
  const [updateCompany, { isLoading }] = useUpdateCompanyMutation();
  const { refetch } = useGetMeQuery();

  const form = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(
      companyProfileSchema
    ) as Resolver<CompanyProfileFormValues>,
    defaultValues: {
      name: "",
      industry: "",
      location: "",
      companySize: "",
      domain: "",
    },
  });

  useEffect(() => {
    if (!user?.company) return;
    
    form.reset({
      name: user.company.name || "",
      industry: user.company.industry || "",
      location: user.company.location || "",
      companySize: user.company.companySize || "",
      domain: user.company.domain || "",
    });
  }, [user, form]);

  const onSubmit = async (values: CompanyProfileFormValues) => {
    try {
      if (!user?.company?.id) {
        toast.error("Company ID not found");
        return;
      }

      // Include the company ID in the update request
      await updateCompany({
        id: user.company.id,
        ...values
      }).unwrap();
      
      // Refetch user data to update the state
      await refetch();
      
      toast.success("Company profile updated successfully");
      
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input placeholder="Enter industry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Size</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companySizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Number of employees in your company
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Domain</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter company domain (e.g., company.com)" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Your company's website domain
              </FormDescription>
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
              "Update Company"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}