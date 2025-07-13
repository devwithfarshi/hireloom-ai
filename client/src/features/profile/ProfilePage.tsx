import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Edit,
  Mail,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  CandidateProfileUpdateFormWithDialog,
  CompanyProfileUpdateFormWithDialog,
  ProfileUpdateFormWithDialog,
} from "./components";

export function ProfilePage() {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName ? user.firstName.charAt(0) : "";
    const lastInitial = user.lastName ? user.lastName.charAt(0) : "";
    return firstInitial + lastInitial || user.email.charAt(0).toUpperCase();
  };

  const getRoleSpecificContent = () => {
    if (!user) return null;

    switch (user.role) {
      case "CANDIDATE":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Candidate Information
                </div>
                {user.candidateProfile && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] h-[90vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          Update Candidate Profile
                        </DialogTitle>
                      </DialogHeader>
                      <CandidateProfileUpdateFormWithDialog />
                    </DialogContent>
                  </Dialog>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.candidateProfile ? (
                <p className="space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Location:</span>
                    {user.candidateProfile.location || "Not specified"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Remote Work:</span>
                    {user.candidateProfile.openToRemote
                      ? "Available"
                      : "Not Available"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Experience:</span>
                    {user.candidateProfile.experience} years
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {user.candidateProfile.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </p>
                  {user.candidateProfile.socialLinks &&
                    user.candidateProfile.socialLinks.length > 0 && (
                      <p className="flex items-start gap-2">
                        <span className="text-muted-foreground">
                          Social Links:
                        </span>
                        <div className="flex flex-col gap-1">
                          {user.candidateProfile.socialLinks.map(
                            (link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                {link.platform}
                              </a>
                            )
                          )}
                        </div>
                      </p>
                    )}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No candidate profile information available.
                </p>
              )}
            </CardContent>
          </Card>
        );
      case "RECRUITER":
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Company Information
                </div>
                {user.company && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-primary" />
                          Update Company Information
                        </DialogTitle>
                      </DialogHeader>
                      <CompanyProfileUpdateFormWithDialog />
                    </DialogContent>
                  </Dialog>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.company ? (
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Company:</span>
                    {user.company.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Industry:</span>
                    {user.company.industry}
                  </p>
                  {user.company.companySize && (
                    <p className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Company Size:
                      </span>
                      {user.company.companySize}
                    </p>
                  )}
                  {user.company.domain && (
                    <p className="flex items-center gap-2">
                      <span className="text-muted-foreground">Domain:</span>
                      <a
                        href={`https://${user.company.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.company.domain}
                      </a>
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Registered:</span>
                    {moment(user.company.createdAt).format("DD MMM YYYY")}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Location:</span>
                    {user.company.location}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No company information available.
                </p>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8 text-primary" /> Profile
        </h1>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="" alt={user?.firstName} />
                  <AvatarFallback className="text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-center">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted-foreground text-center mb-4">
                  {user?.role}
                </p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 mt-2"
                    >
                      <Edit className="h-4 w-4" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5 text-primary" />
                        Update Profile
                      </DialogTitle>
                    </DialogHeader>
                    <ProfileUpdateFormWithDialog />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Details Card */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Name:</span>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        {user.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Role:</span>
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                          {user.role}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        {user.isVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-muted-foreground">
                          Account Status:
                        </span>
                        {user.isVerified ? (
                          <span className="text-green-500">Verified</span>
                        ) : (
                          <span className="text-red-500">Not Verified</span>
                        )}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Member Since:
                        </span>
                        {moment(user.createdAt).format("MMMM YYYY")}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        variant="destructive"
                        disabled
                        className="flex items-center gap-2"
                      >
                        Delete Account
                      </Button>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Account deletion is not available at this time.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role-specific content */}
            {getRoleSpecificContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
