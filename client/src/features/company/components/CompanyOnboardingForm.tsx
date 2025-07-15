import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { handleApiError } from "@/lib/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Building, MapPin, Briefcase } from "lucide-react";
import { useCreateCompanyMutation } from "../companyApi";
import { CompanyFormValues, companySchema } from "../schemas";

export function CompanyOnboardingForm() {
  const [createCompany, { isLoading }] = useCreateCompanyMutation();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      industry: "",
      location: "",
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      await createCompany(values).unwrap();
      toast.success("Company created successfully!");
      window.location.reload();
    } catch (error: any) {
      handleApiError(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 shadow-2xl overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-5" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Set Up Your Company
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Provide your company details to start hiring top talent
              </p>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company name"
                        className="border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        {...field}
                      />
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
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Industry
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your industry (e.g., Technology, Healthcare)"
                        className="border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        {...field}
                      />
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
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company location"
                        className="border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating Company...
                  </>
                ) : (
                  "Create Company"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-50" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-50" />
      </Card>
    </div>
  );
}
