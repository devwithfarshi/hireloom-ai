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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyApplicationsQuery } from "@/features/application/applicationApi";
import { ApplicationStatus } from "@/types";
import { EmploymentType } from "@/features/job/jobApi";
import { BuildingIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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

const formatApplicationStatus = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "Pending";
    case ApplicationStatus.REVIEWED:
      return "Reviewed";
    case ApplicationStatus.SHORTLISTED:
      return "Shortlisted";
    case ApplicationStatus.HIRED:
      return "Hired";
    case ApplicationStatus.REJECTED:
      return "Rejected";
    default:
      return status;
  }
};

const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case ApplicationStatus.REVIEWED:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case ApplicationStatus.SHORTLISTED:
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case ApplicationStatus.HIRED:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case ApplicationStatus.REJECTED:
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

export function MyApplicationsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading, error } = useGetMyApplicationsQuery({
    page,
    limit,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = data?.metadata?.total
    ? Math.ceil(data.metadata.total / limit)
    : 0;

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
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

      // Calculate start and end of visible pages
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(startPage + 2, totalPages - 1);

      // Adjust if we're near the end
      if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - 2);
      }

      // Add ellipsis if needed before visible pages
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
        );
      }

      // Add visible pages
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

      // Add ellipsis if needed after visible pages
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationLink>...</PaginationLink>
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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive">
                Failed to load applications. Please try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>
            Track the status of your job applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You haven't applied to any jobs yet.
              </p>
              <Button asChild className="mt-4">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.data.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">
                          {application.job?.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getStatusColor(application.status)}
                        >
                          {formatApplicationStatus(application.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <BuildingIcon className="h-4 w-4 mr-1" />
                        <span>{application.job?.company?.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center text-muted-foreground">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{application.job?.location}</span>
                        </div>
                        {application.job?.employmentType && (
                          <div className="flex items-center text-muted-foreground">
                            <span>
                              {formatEmploymentType(
                                application.job.employmentType as EmploymentType
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            Applied on{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="ml-auto"
                        >
                          <Link to={`/jobs/${application.jobId}`}>
                            View Job
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, page + 1))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
