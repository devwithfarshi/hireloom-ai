import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Mail, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { handleApiError } from "@/lib/errorHandler";
import { useVerifyEmailMutation } from "../authApi";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verifyEmail] = useVerifyEmailMutation();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Verification token is missing");
        navigate("/login");
        return;
      }

      try {
        await verifyEmail({ token }).unwrap();
        setVerified(true);
        setStatus("success");
        toast.success("Email verified successfully");
        navigate("/login");
      } catch (error: any) {
        setError(error?.data?.message || "Failed to verify email");
        handleApiError(error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="max-w-md mx-auto">
        <Card className="relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 shadow-2xl overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-5" />
          
          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Verifying Email
                </h1>
                <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                  <Spinner size="lg" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Please wait while we verify your email...
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-50" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-50" />
        </Card>
      </div>
    );
  }

  if (error) {
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
                  Verification Failed
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{error}</p>
              </div>
            </div>
            
            {/* Action */}
            <div className="text-center">
              <Link to="/login">
                <Button className="py-3 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-red-500 to-orange-600 text-white border-0 inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
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

  if (verified) {
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
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Email Verified
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Your email has been verified successfully. You can now log in to
                  your account.
                </p>
              </div>
            </div>
            
            {/* Action */}
            <div className="text-center">
              <Link to="/login">
                <Button className="py-3 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-green-500 to-teal-600 text-white border-0 inline-flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Go to Login
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

  return null;
}
