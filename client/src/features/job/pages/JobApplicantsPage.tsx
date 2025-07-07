import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Application,
  useGetJobApplicationsQuery,
} from "@/services/applicationApi";
import { ApplicationStatus } from "@/types";
import { ArrowLeftIcon, FileIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetJobByIdQuery } from "../jobApi";

export function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<ApplicationStatus | undefined>();

  const { data: job, isLoading: isJobLoading } = useGetJobByIdQuery(id!);
  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useGetJobApplicationsQuery(
      { jobId: id!, page, limit, status },
      { skip: !id }
    );

  const handleBack = () => {
    navigate(`/jobs/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? undefined : (value as ApplicationStatus));
    setPage(1);
  };

  const totalPages = applicationsData?.metadata?.total
    ? Math.ceil(applicationsData.metadata.total / limit)
    : 0;

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={page === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is more than 3
      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and surrounding pages
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is less than total pages - 2
      if (page < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isJobLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Skeleton className="h-10 w-24 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
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
        Back to Job
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">
                Applicants for {job?.title}
              </CardTitle>
              <CardDescription>
                Review and manage candidates who applied for this position
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={status || ""} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ApplicationStatus.PENDING}>
                    Pending
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.REVIEWING}>
                    Reviewing
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.INTERVIEW}>
                    Interview
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.ACCEPTED}>
                    Accepted
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.REJECTED}>
                    Rejected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isApplicationsLoading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
          ) : applicationsData?.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No applications found for this job.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicationsData?.data.map((application: Application) => (
                <Card key={application.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {application.candidate?.firstName}{" "}
                          {application.candidate?.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {application.candidate?.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusVariant(application.status)}
                          className="capitalize"
                        >
                          {application.status.toLowerCase()}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/applications/${application.id}`)
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4">
                      {application.candidate?.candidateProfile?.skills?.map(
                        (skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        )
                      )}
                    </div>

                    {application.candidate?.candidateProfile?.resumeUrl && (
                      <div className="mt-4">
                        <a
                          href={
                            application.candidate.candidateProfile.resumeUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary hover:underline"
                        >
                          <FileIcon className="h-4 w-4 mr-1" />
                          View Resume
                        </a>
                      </div>
                    )}

                    {application.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm">{application.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (page > 1) {
                          handlePageChange(page - 1);
                        }
                      }}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (page < totalPages) {
                          handlePageChange(page + 1);
                        }
                      }}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusVariant(
  status: ApplicationStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "outline";
    case ApplicationStatus.REVIEWING:
      return "secondary";
    case ApplicationStatus.INTERVIEW:
      return "default";
    case ApplicationStatus.ACCEPTED:
      return "default";
    case ApplicationStatus.REJECTED:
      return "destructive";
    default:
      return "outline";
  }
}
