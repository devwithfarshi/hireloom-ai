import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks";
import { Role } from "@/features/auth/types";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  BuildingIcon,
  ClockIcon,
  Globe2,
  MapPinIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EmploymentType, useGetJobByIdQuery } from "../jobApi";
import { useCreateApplicationMutation } from "@/features/application/applicationApi";

const formatEmploymentType = (type: EmploymentType): string => {
  switch (type) {
    case EmploymentType.FULL_TIME:
      return "Full Time";
    case EmploymentType.PART_TIME:
      return "Part Time";
    case EmploymentType.CONTRACT:
      return "Contract";
    case EmploymentType.FREELANCE:
      return "Freelance";
    default:
      return type;
  }
};

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading, error } = useGetJobByIdQuery(id!);

  const handleBack = () => {
    navigate(-1);
  };

  const [createApplication, { isLoading: isApplying }] =
    useCreateApplicationMutation();

  const handleApply = async () => {
    if (!id) return;

    try {
      await createApplication({ jobId: id }).unwrap();
      toast.success("Your application has been submitted successfully!");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to submit application. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container  mx-auto max-w-4xl py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading job details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive">
                Failed to load job details. Please try again.
              </p>
              <Button variant="outline" onClick={handleBack} className="mt-4">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Button variant="outline" onClick={handleBack} className="mb-6">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center">
                  <BuildingIcon className="h-4 w-4 mr-1" />
                  <span>{job.company?.name || "Company"}</span>
                </div>
                {job.company?.domain && (
                  <div className="flex items-center">
                    <Globe2 className="h-4 w-4 mr-1" />{" "}
                    <a
                      href={
                        job.company?.domain
                          ? new URL(job.company.domain).href
                          : "#"
                      }
                    >
                      {job.company?.domain}
                    </a>
                  </div>
                )}
              </CardDescription>
            </div>
            {!job.active && (
              <Badge
                variant="outline"
                className="bg-muted text-muted-foreground"
              >
                Inactive
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{formatEmploymentType(job.employmentType)}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <BriefcaseIcon className="h-4 w-4 mr-1" />
              <span>
                {job.experience} {job.experience === 1 ? "year" : "years"}{" "}
                experience
              </span>
            </div>
            {job.isRemote && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200"
              >
                Remote Position
              </Badge>
            )}
          </div>

          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            {isAuthenticated && user?.role === Role.RECRUITER && (
              <Button
                onClick={() => navigate(`/jobs/${id}/applicants`)}
                variant="outline"
              >
                <UsersIcon className="mr-2 h-4 w-4" />
                View Applicants
              </Button>
            )}
            {isAuthenticated && user?.role === Role.CANDIDATE && (
              <Button onClick={handleApply} disabled={isApplying}>
                <SendIcon className="mr-2 h-4 w-4" />
                {isApplying ? "Submitting..." : "Apply Now"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
