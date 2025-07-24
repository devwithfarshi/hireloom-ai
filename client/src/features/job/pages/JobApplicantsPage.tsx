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
  useUpdateApplicationMutation,
  useStartScoringMutation,
} from "@/features/application/applicationApi";
import { ApplicationStatus } from "@/features/application/types";
import {
  ArrowLeftIcon,
  FileIcon,
  SparklesIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetJobByIdQuery,
  ScoringStatus,
} from "../jobApi";
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
  const [updateApplication, { isLoading: isUpdatingApplication }] =
    useUpdateApplicationMutation();
  const {
    data: applicationsData,
    isLoading: isApplicationsLoading,
    refetch,
    isFetching,
  } = useGetJobApplicationsQuery(
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

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      await updateApplication({
        id: applicationId,
        data: { status: newStatus },
      }).unwrap();
      toast.success("Application status updated successfully");
      refetch();
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
    <div className="container mx-auto max-w-4xl px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6 flex justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleBack}
            size="sm"
            className="sm:size-default"
          >
            <ArrowLeftIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            size="sm"
            className="flex items-center gap-1 sm:gap-2 sm:size-default"
          >
            <RefreshCwIcon
              className={`h-3 w-3 sm:h-4 sm:w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
        {job?.scoringStatus === ScoringStatus.PENDING ? (
          <Dialog>
            <DialogTrigger
              disabled={
                job?.scoringStatus !== ScoringStatus.PENDING ||
                isStartScoringLoading
              }
            >
              <Button
                variant="outline"
                className="py-2 sm:py-3 px-3 sm:px-4 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:text-white text-sm sm:text-base"
                disabled={
                  job?.scoringStatus !== ScoringStatus.PENDING ||
                  isStartScoringLoading
                }
              >
                <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  {isStartScoringLoading ? "Loading..." : "Start Scoring"}
                </span>
                <span className="sm:hidden">
                  {isStartScoringLoading ? "Loading..." : "Score"}
                </span>
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
            {job?.scoringStatus === ScoringStatus.SCORING
              ? "In Scoring"
              : "Scoring Complete"}
          </Badge>
        )}
      </div>
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-2xl">
                Applicants for {job?.title}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Review and manage candidates who applied for this position
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Select value={status || ""} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px] sm:w-[180px] text-sm sm:text-base">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ApplicationStatus.PENDING}>
                    Pending
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.REVIEWED}>
                    Reviewed
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.SHORTLISTED}>
                    Shortlisted
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.HIRED}>Hired</SelectItem>
                  <SelectItem value={ApplicationStatus.REJECTED}>
                    Rejected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isApplicationsLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-20 sm:h-24 w-full" />
                ))}
            </div>
          ) : applicationsData?.data.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-muted-foreground text-sm sm:text-base px-4">
                No applications found for this job.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {applicationsData?.data.map((application: Application) => {
                const notes = application.notes
                  ? (JSON.parse(application.notes) as {
                      score: number;
                      reasoning: string;
                      strengths: string[];
                      weaknesses: string[];
                      recommendations: string[];
                    })
                  : null;
                return (
                  <Card key={application.id} className="overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg flex flex-col sm:flex-row sm:items-center gap-2">
                            <span>
                              {application.candidate?.user?.firstName}{" "}
                              {application.candidate?.user?.lastName}
                            </span>
                            {application.score !== undefined &&
                              application.score !== null && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-fit">
                                  Score: {application.score.toFixed(1)}
                                </span>
                              )}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {application.candidate?.user?.email}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Select
                            value={application.status}
                            onValueChange={(newStatus: ApplicationStatus) =>
                              handleStatusUpdate(application.id, newStatus)
                            }
                            disabled={isUpdatingApplication}
                          >
                            <SelectTrigger className="w-full sm:w-[140px] text-sm">
                              <SelectValue>
                                <Badge
                                  variant={getStatusVariant(application.status)}
                                  className="capitalize text-xs"
                                >
                                  {application.status.toLowerCase()}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ApplicationStatus.PENDING}>
                                Pending
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.REVIEWED}>
                                Reviewed
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.SHORTLISTED}>
                                Shortlisted
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.HIRED}>
                                Hired
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.REJECTED}>
                                Rejected
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/applications/${application.id}`)
                            }
                            className="w-full sm:w-auto text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">
                              View Details
                            </span>
                            <span className="sm:hidden">Details</span>
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                        {application.candidate?.skills?.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-3 sm:mt-4">
                        <ResumeViewLink
                          candidateUserId={application.candidate?.user?.id}
                        />
                      </div>

                      {notes && (
                        <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                          <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">
                              AI Assessment
                            </h4>
                            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                              {notes.reasoning}
                            </p>
                          </div>

                          {notes.strengths && notes.strengths.length > 0 && (
                            <div className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                              <h5 className="text-xs sm:text-sm font-medium text-green-900 mb-2">
                                Strengths
                              </h5>
                              <ul className="text-xs sm:text-sm text-green-800 space-y-1">
                                {notes.strengths.map((strength, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-green-600 mr-2 text-xs">
                                      •
                                    </span>
                                    <span className="flex-1">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {notes.weaknesses && notes.weaknesses.length > 0 && (
                            <div className="p-2 sm:p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <h5 className="text-xs sm:text-sm font-medium text-orange-900 mb-2">
                                Areas for Improvement
                              </h5>
                              <ul className="text-xs sm:text-sm text-orange-800 space-y-1">
                                {notes.weaknesses.map((weakness, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-orange-600 mr-2 text-xs">
                                      •
                                    </span>
                                    <span className="flex-1">{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {notes.recommendations &&
                            notes.recommendations.length > 0 && (
                              <div className="p-2 sm:p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <h5 className="text-xs sm:text-sm font-medium text-purple-900 mb-2">
                                  Recommendations
                                </h5>
                                <ul className="text-xs sm:text-sm text-purple-800 space-y-1">
                                  {notes.recommendations.map(
                                    (recommendation, index) => (
                                      <li
                                        key={index}
                                        className="flex items-start"
                                      >
                                        <span className="text-purple-600 mr-2 text-xs">
                                          •
                                        </span>
                                        <span className="flex-1">
                                          {recommendation}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 sm:mt-6 flex justify-center">
              <Pagination>
                <PaginationContent className="gap-1 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (page > 1) {
                          handlePageChange(page - 1);
                        }
                      }}
                      className={`text-xs sm:text-sm ${
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }`}
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
                      className={`text-xs sm:text-sm ${
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
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
    case ApplicationStatus.REVIEWED:
      return "secondary";
    case ApplicationStatus.SHORTLISTED:
      return "default";
    case ApplicationStatus.HIRED:
      return "default";
    case ApplicationStatus.REJECTED:
      return "destructive";
    default:
      return "outline";
  }
}
