import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { handleApiError } from "@/lib/errorHandler";
import { useVerifyEmailMutation } from "../authApi";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Verification token is missing");
        return;
      }

      try {
        await verifyEmail({ token }).unwrap();
        setVerified(true);
        setStatus("success");
        toast.success("Email verified successfully");
      } catch (error: any) {
        setError(error?.data?.message || "Failed to verify email");
        handleApiError(error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token, verifyEmail]);

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verifying Email</h1>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Spinner size="lg" />
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we verify your email...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verification Failed</h1>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <div className="pt-4">
            <Link to="/login">
              <Button>Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Email Verified</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Your email has been verified successfully. You can now log in to
            your account.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
