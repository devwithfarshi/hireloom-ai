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
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              View Details
            </Button>
            {isRecruiter && (
              <div className="flex gap-2">
                {onEdit && (
                  <Button variant="secondary" onClick={() => onEdit(job)}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(job.id)}
                  >
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
