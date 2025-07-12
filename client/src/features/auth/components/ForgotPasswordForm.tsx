import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../schemas';
import { useForgotPasswordMutation } from '../authApi';
import { handleApiError } from '@/lib/errorHandler';
import { Spinner } from '@/components/ui/spinner';

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(values).unwrap();
      toast.success('Password reset instructions sent to your email');
      form.reset();
    } catch (error: any) {
      handleApiError(error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 shadow-2xl overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-5" />
        
        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Forgot Password?
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>
          </div>
          
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        autoComplete="email"
                        className="border-2 focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full py-3 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-orange-500 to-red-600 text-white border-0"
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" className="mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </Button>
            </form>
          </Form>
          
          {/* Footer */}
          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors inline-flex items-center">
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