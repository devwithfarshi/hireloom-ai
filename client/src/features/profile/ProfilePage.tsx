import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { ProfileUpdateForm } from "./components";
import moment from "moment";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link to="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Your Profile</h2>
          {user && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {user.firstName}{" "}
                  {user.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Account Status:</span>{" "}
                  {user.isVerified ? "Verified" : "Not Verified"}
                </p>
                <p>
                  <span className="font-medium">Member From:</span>{" "}
                  {moment(user.createdAt).format("MMMM YYYY")}
                </p>
              </div>

              <div className="pt-4">
                <Button variant="destructive" disabled>
                  Delete Account
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  Account deletion is not available at this time.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Update Profile</h2>
          <ProfileUpdateForm />
        </div>
      </div>
    </div>
  );
}
