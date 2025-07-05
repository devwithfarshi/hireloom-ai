import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

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
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
          <p className="text-gray-500 dark:text-gray-400">
            The password reset link is invalid or has expired.
          </p>
          <div className="pt-4">
            <Link to="/forgot-password">
              <Button>Request a new reset link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your new password below
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Spinner size="sm" className="mr-2" />}
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-primary">
          Back to login
        </Link>
      </div>
    </div>
  );
}
