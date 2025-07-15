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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { PDFViewer } from "@/components/ui/pdf-viewer";
import {
  Application,
  useGetJobApplicationsQuery,
  useStartScoringMutation,
} from "@/services/applicationApi";
import { ApplicationStatus } from "@/types";
import { ArrowLeftIcon, FileIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetJobByIdQuery } from "../jobApi";
import { useGetResumeByCandidateIdQuery } from "@/features/profile/resumeApi";

// Component to handle resume viewing
function ResumeViewLink({ candidateUserId }: { candidateUserId?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    data: resumeData,
    isLoading,
    error,
  } = useGetResumeByCandidateIdQuery(candidateUserId!, {
    skip: !candidateUserId || !isDialogOpen,
  });

  if (!candidateUserId) {
    return null;
  }

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleDialogOpen}>
            <FileIcon className="h-4 w-4 mr-2" />
            View Resume
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Resume</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading resume...
                  </p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <p className="text-destructive mb-4">Failed to load resume</p>
                  <Button variant="outline" onClick={handleDialogClose}>
                    Close
                  </Button>
                </div>
              </div>
            )}
            {resumeData?.url && !isLoading && !error && (
              <PDFViewer url={resumeData.url} height={600} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { handleApiError } from "@/lib/errorHandler";

export function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<ApplicationStatus | undefined>();

  const { data: job, isLoading: isJobLoading } = useGetJobByIdQuery(id!);
  const [startScoring, { isLoading: isStartScoringLoading }] =
    useStartScoringMutation();
  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useGetJobApplicationsQuery(
      { jobId: id!, page, limit, status },
      { skip: !id }
    );

  const handleBack = () => {
    navigate(-1);
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
  const handleStartScoring = async () => {
    try {
      await startScoring(id!).unwrap();
      toast.success("Scoring started successfully");
      setPage(1);
    } catch (error: any) {
      handleApiError(error);
    }
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
      <div className="mb-6 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
        {!job?.isScoring ? (
          <Dialog>
            <DialogTrigger disabled={job?.isScoring || isStartScoringLoading}>
              <Button
                variant="outline"
                className=" py-3 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:text-white"
                disabled={job?.isScoring || isStartScoringLoading}
              >
                <SparklesIcon className="h-4 w-4" />
                {isStartScoringLoading ? "Loading..." : "Start Scoring"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Start Scoring</DialogTitle>
              <DialogDescription>
                Job will be inactive after scoring is started.
              </DialogDescription>
              <DialogFooter>
                <DialogClose>
                  <Button
                    variant="outline"
                    className=" py-3 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:text-white"
                    onClick={handleStartScoring}
                  >
                    Start Scoring
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:text-white">
            In Scoring
          </Badge>
        )}
      </div>
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
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {application.candidate?.user?.firstName}{" "}
                          {application.candidate?.user?.lastName}
                          {application.score !== undefined &&
                            application.score !== null && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                Score: {application.score.toFixed(1)}
                              </span>
                            )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {application.candidate?.user?.email}
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
                      {application.candidate?.skills?.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <ResumeViewLink
                      candidateUserId={application.candidate?.user?.id}
                    />

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
