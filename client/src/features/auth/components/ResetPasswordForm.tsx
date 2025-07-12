import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Key, Eye, EyeOff, ArrowLeft, AlertTriangle } from "lucide-react";

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
import { resetPasswordSchema, ResetPasswordFormValues } from "../schemas";
import { useResetPasswordMutation } from "../authApi";
import { handleApiError } from "@/lib/errorHandler";
import { Spinner } from "@/components/ui/spinner";

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    try {
      const { confirmPassword: _, ...resetData } = values;
      await resetPassword({ token, password: resetData.password }).unwrap();
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error: any) {
      handleApiError(error);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 shadow-2xl overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 opacity-5" />
          
          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Invalid Reset Link
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  The password reset link is invalid or has expired.
                </p>
              </div>
            </div>
            
            {/* Action */}
            <div className="text-center">
              <Link to="/forgot-password">
                <Button className="bg-gradient-to-r from-red-500 to-orange-600 text-white border-0 hover:scale-105 transition-all duration-200">
                  Request a new reset link
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-50" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-50" />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 shadow-2xl overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 opacity-5" />
        
        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-lg">
              <Key className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Reset Password
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your new password below
              </p>
            </div>
          </div>
          
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="border-2 focus:border-green-500 dark:focus:border-green-400 transition-colors pr-12"
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
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="border-2 focus:border-green-500 dark:focus:border-green-400 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full py-3 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-green-500 to-teal-600 text-white border-0"
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" className="mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                {isLoading ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </Form>
          
          {/* Footer */}
          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors inline-flex items-center">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Back to login
              </Link>
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-50" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-50" />
      </Card>
    </div>
  );
}
