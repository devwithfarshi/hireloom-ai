import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Role } from "../types";
import { ArrowLeft, Building, Eye, EyeOff, Search } from "lucide-react";

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
import { useRegisterMutation } from "../authApi";
import { RegisterFormValues, registerSchema } from "../schemas";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [register, { isLoading }] = useRegisterMutation();

  // Get role from URL search params
  const role = searchParams.get("role") as
    | Role.RECRUITER
    | Role.CANDIDATE
    | null;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: role || undefined,
    },
  });

  // Update form when role changes in URL
  useEffect(() => {
    if (role) {
      form.setValue("role", role);
    }
  }, [role, form]);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword: _, ...registerData } = values;
      await register({
        ...registerData,
        role: registerData.role,
      }).unwrap();
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );

      // Always redirect to login page after registration
      // User will be redirected to appropriate onboarding page after login if needed
      navigate("/login");
    } catch (error: any) {
      handleApiError(error);
    }
  };

  // Get role configuration
  const getRoleConfig = () => {
    if (role === Role.RECRUITER) {
      return {
        icon: Building,
        title: "Recruiter",
        subtitle: "Hire top talent",
        gradient: "from-blue-500 to-purple-600",
        bgGradient:
          "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
      };
    } else if (role === Role.CANDIDATE) {
      return {
        icon: Search,
        title: "Candidate",
        subtitle: "Find your dream job",
        gradient: "from-emerald-500 to-teal-600",
        bgGradient:
          "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      };
    }
    return null;
  };

  const roleConfig = getRoleConfig();

  return (
    <div className="max-w-md mx-auto">
      <Card
        className={`relative p-8 bg-gradient-to-br ${roleConfig ? roleConfig.bgGradient : "from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"} border-2 shadow-2xl overflow-hidden`}
      >
        {/* Background gradient overlay */}
        {roleConfig && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${roleConfig.gradient} opacity-5`}
          />
        )}

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Back button and role header */}
          {role && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/register")}
                className="p-0 h-auto font-normal text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to role selection
              </Button>

              {roleConfig && (
                <div className="text-center space-y-3">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${roleConfig.gradient} rounded-2xl shadow-lg`}
                  >
                    <roleConfig.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {roleConfig.title} Registration
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {roleConfig.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Header for non-role specific */}
          {!role && (
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Create an account
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your details below to create your account
              </p>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        autoComplete="email"
                        className="border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={`w-full py-3 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  roleConfig
                    ? `bg-gradient-to-r ${roleConfig.gradient} text-white border-0`
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
                }`}
                disabled={isLoading}
              >
                {isLoading && <Spinner size="sm" className="mr-2" />}
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        {roleConfig && (
          <>
            <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-50" />
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-50" />
          </>
        )}
      </Card>
    </div>
  );
}
