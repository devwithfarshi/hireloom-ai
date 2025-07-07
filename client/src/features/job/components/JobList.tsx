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
import { useNavigate } from "react-router-dom";
import { EmploymentType, Job } from "../jobApi";
import { useAuth } from "@/features/auth/hooks";
import { Role } from "@/features/auth/types";
import { Eye, Users, Edit, Trash2 } from "lucide-react";

interface JobListProps {
  jobs: Job[];
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  isRecruiter?: boolean;
}

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

export function JobList({
  jobs,
  onEdit,
  onDelete,
  isRecruiter = false,
}: JobListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userIsRecruiter = user?.role === Role.RECRUITER;

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <Card key={job.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-2">{job.title}</CardTitle>
                <CardDescription className="mt-1">
                  {job.company?.name || "Company"} • {job.location}
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
          <CardContent className="flex-grow">
            <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {formatEmploymentType(job.employmentType)}
              </Badge>
              <Badge variant="secondary">
                {job.experience} {job.experience === 1 ? "year" : "years"}
              </Badge>
              {job.isRemote && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                  Remote
                </Badge>
              )}
              {job.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {job.tags.length > 3 && (
                <Badge variant="outline">+{job.tags.length - 3}</Badge>
              )}
            </div>
              <div
                className="text-sm text-muted-foreground line-clamp-3 mt-2"
                dangerouslySetInnerHTML={{
                  __html:
                    job.description.replace(/<[^>]*>/g, " ").substring(0, 150) +
                    "...",
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t pt-4">
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
              {(isRecruiter || userIsRecruiter) && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Applicants
                </Button>
              )}
            </div>
            {(isRecruiter || userIsRecruiter) && (onEdit || onDelete) && (
              <div className="flex w-full gap-2">
                {onEdit && (
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => onEdit(job)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => onDelete(job.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
