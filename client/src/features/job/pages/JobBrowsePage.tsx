import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { SearchIcon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/lib/store";
import { JobList } from "../components/JobList";
import { StreamingSearchProgress } from "../components/StreamingSearchProgress";
import { AiLoader } from "@/components/ui/ai-loader";
import {
  EmploymentType,
  Job,
  useDeleteJobMutation,
  useGetJobsQuery,
} from "../jobApi";
import { useFilterDebounce } from "../hooks/useFilterDebounce";
import { useStreamingAiSearch } from "../hooks/useStreamingAiSearch";

export function JobBrowsePage() {
  const navigate = useNavigate();
  const {
    inputValues,
    debouncedValues,
    setSearch,
    setLocation,
    setEmploymentType,
    setIsRemote,
    resetFilters,
  } = useFilterDebounce();

  const [currentPage, setCurrentPage] = useState(1);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAiContent, setShowAiContent] = useState(false);
  const limit = 9;

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Use streaming AI search hook
  const {
    state: streamingState,
    startSearch: startStreamingSearch,
    stopSearch: stopStreamingSearch,
    resetSearch: resetStreamingSearch,
  } = useStreamingAiSearch();

  const handleAiToggle = async () => {
    setIsTransitioning(true);

    if (isAiMode) {
      // Transitioning from AI to normal mode
      setShowAiContent(false);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsAiMode(false);
      resetStreamingSearch(); // Clear streaming search results
    } else {
      // Transitioning from normal to AI mode
      setIsAiMode(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setShowAiContent(true);
    }

    setIsTransitioning(false);
  };

  const handleAiSearch = () => {
    if (!aiQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    if (!currentUser?.id) {
      toast.error("Please log in to use AI search");
      return;
    }

    // Start streaming search
    startStreamingSearch(aiQuery, currentUser.id);
  };

  const {
    data: jobsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetJobsQuery({
    search: debouncedValues.search || undefined,
    employmentType:
      (debouncedValues.employmentType as EmploymentType) || undefined,
    location: debouncedValues.location || undefined,
    active: true, // Only show active jobs
    isRemote: debouncedValues.isRemote || undefined,
    page: currentPage,
    limit,
  });

  const [deleteJob] = useDeleteJobMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditJob = (job: Job) => {
    navigate(`/dashboard/jobs/edit/${job.id}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(jobId).unwrap();
        toast.success("Job deleted successfully");
        refetch();
      } catch (error) {
        console.error("Failed to delete job:", error);
        toast.error("Failed to delete job. Please try again.");
      }
    }
  };

  const totalPages = jobsData?.metadata.total
    ? Math.ceil(jobsData.metadata.total / limit)
    : 0;

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
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
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is more than 3
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and surrounding pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is less than total pages - 2
      if (currentPage < totalPages - 2) {
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
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Find Your Next Opportunity
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Browse through available job opportunities
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 w-fit"
          >
            <RefreshCwIcon
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="mb-6 sm:mb-8">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Search Jobs</CardTitle>
              <CardDescription className="text-sm">
                {isAiMode
                  ? "Use AI to find your perfect job match"
                  : "Filter jobs by title, location, and employment type"}
              </CardDescription>
            </div>
            <Button
              variant={isAiMode ? "default" : "outline"}
              onClick={handleAiToggle}
              disabled={isTransitioning}
              className={`flex items-center gap-2 transition-all duration-300 transform hover:scale-105 self-start sm:self-auto text-sm sm:text-base ${
                isAiMode
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                  : "hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              <SparklesIcon
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${
                  isAiMode ? "animate-pulse text-white" : "text-current"
                } ${isTransitioning ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isTransitioning ? "Switching..." : "Start with HiRa"}
              </span>
              <span className="sm:hidden">
                {isTransitioning ? "Switching..." : "HiRa Search"}
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative overflow-hidden">
          {/* Animated background particles for HiRa mode */}
          {isAiMode && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse`}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 3) * 30}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>
          )}

          <div
            className={`transition-all duration-500 ease-in-out ${
              isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {isAiMode ? (
              <div
                className={`space-y-4 transition-all duration-700 ease-out transform ${
                  showAiContent
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-8 opacity-0 scale-95"
                }`}
              >
                <div className="relative">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-lg opacity-60 animate-pulse"></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-lg animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>

                  <div className="relative p-4 sm:p-6 border-2 border-dashed border-blue-200 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      <div className="relative p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full self-start">
                        <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-pulse" />
                        {/* Pulsing ring effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                          AI-Powered Job Search
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Describe your ideal job and let AI find the perfect
                          matches
                        </p>
                      </div>
                      {/* Floating sparkles */}
                      <div className="relative hidden sm:block">
                        {[...Array(3)].map((_, i) => (
                          <SparklesIcon
                            key={i}
                            className={`absolute h-3 w-3 text-blue-400 animate-bounce opacity-60`}
                            style={{
                              right: `${i * 8}px`,
                              top: `${-5 + i * 3}px`,
                              animationDelay: `${i * 0.3}s`,
                              animationDuration: "1.5s",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative group">
                      <SparklesIcon className="absolute left-3 sm:left-4 top-3 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-blue-500 animate-pulse z-10" />
                      {/* Typing indicator when empty */}
                      {!aiQuery && (
                        <div className="absolute left-10 sm:left-12 top-3 sm:top-4 flex items-center space-x-1">
                          <div className="w-1 h-3 sm:h-4 bg-blue-400 animate-pulse"></div>
                          <span className="text-blue-400 text-xs sm:text-sm animate-pulse">
                            AI is ready to help...
                          </span>
                        </div>
                      )}
                      <textarea
                        placeholder="Tell me about your dream job... (e.g., 'I'm looking for a remote frontend developer position with React and TypeScript, preferably at a startup with good work-life balance')"
                        className="w-full min-h-[100px] sm:min-h-[120px] pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-blue-200 rounded-lg resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:shadow-lg focus:shadow-xl text-sm sm:text-base"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                      />
                      {/* Gradient border effect on focus */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleAiSearch}
                        disabled={streamingState.isSearching || !aiQuery.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {streamingState.isSearching ? (
                          <div className="flex items-center">
                            <div className="relative mr-2">
                              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border border-white border-t-transparent animate-spin" />
                              <SparklesIcon
                                className="absolute inset-0 h-3 w-3 sm:h-4 sm:w-4 text-white animate-pulse"
                                style={{ animationDuration: "2s" }}
                              />
                            </div>
                            <span className="hidden sm:inline">
                              AI Searching...
                            </span>
                            <span className="sm:hidden">Searching...</span>
                          </div>
                        ) : (
                          <>
                            <SparklesIcon
                              className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-pulse"
                              style={{ animationDuration: "3s" }}
                            />
                            <span className="hidden sm:inline">
                              Search with AI
                            </span>
                            <span className="sm:hidden">AI Search</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`transition-all duration-700 ease-out transform ${
                  !isAiMode && !isTransitioning
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-8 opacity-0 scale-95"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="search"
                      className="text-sm font-medium mb-1 block"
                    >
                      Search
                    </label>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by job title"
                        className="pl-9 text-sm sm:text-base"
                        value={inputValues.search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setCurrentPage(1); // Reset to first page on search change
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="text-sm font-medium mb-1 block"
                    >
                      Location
                    </label>
                    <Input
                      id="location"
                      placeholder="Enter location"
                      className="text-sm sm:text-base"
                      value={inputValues.location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setCurrentPage(1); // Reset to first page on location change
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label
                      htmlFor="employmentType"
                      className="text-sm font-medium mb-1 block"
                    >
                      Employment Type
                    </label>
                    <Select
                      value={inputValues.employmentType || "all"}
                      onValueChange={(value) => {
                        setEmploymentType(value);
                        setCurrentPage(1); // Reset to first page on type change
                      }}
                    >
                      <SelectTrigger
                        id="employmentType"
                        className="w-full text-sm sm:text-base"
                      >
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value={EmploymentType.FULL_TIME}>
                          Full Time
                        </SelectItem>
                        <SelectItem value={EmploymentType.PART_TIME}>
                          Part Time
                        </SelectItem>
                        <SelectItem value={EmploymentType.CONTRACT}>
                          Contract
                        </SelectItem>
                        <SelectItem value={EmploymentType.FREELANCE}>
                          Freelance
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <label
                    htmlFor="isRemote"
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      id="isRemote"
                      type="checkbox"
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={inputValues.isRemote}
                      onChange={(e) => {
                        setIsRemote(e.target.checked);
                        setCurrentPage(1); // Reset to first page on remote change
                      }}
                    />
                    <span className="text-sm font-medium">
                      Remote positions only
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Show AI loading indicator when AI search is active but no jobs received yet */}
      {isAiMode &&
        streamingState.isSearching &&
        streamingState.jobs.length === 0 &&
        !streamingState.error && (
          <div className="text-center py-8 sm:py-12">
            <AiLoader
              size="lg"
              text="AI is analyzing your request and finding perfect matches..."
              className="mx-auto"
            />
          </div>
        )}

      {/* Show streaming progress when in AI mode and search has results or completed */}
      {isAiMode &&
        (streamingState.jobs.length > 0 ||
          streamingState.error ||
          (streamingState.progress > 0 && !streamingState.isSearching)) && (
          <StreamingSearchProgress
            state={streamingState}
            onStop={stopStreamingSearch}
            onReset={() => {
              resetStreamingSearch();
              setAiQuery("");
            }}
          />
        )}

      {(isLoading || isFetching) && !isAiMode ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-muted-foreground text-sm sm:text-base">
            Loading jobs...
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 sm:space-y-6">
            <JobList
              jobs={
                isAiMode && streamingState.jobs.length > 0
                  ? streamingState.jobs
                  : jobsData?.data || []
              }
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              isAiMode={isAiMode && streamingState.jobs.length > 0}
            />
          </div>

          {/* Show different empty states for AI vs regular search */}
          {isAiMode &&
            !streamingState.isSearching &&
            streamingState.progress === 100 &&
            streamingState.jobs.length === 0 &&
            !streamingState.error && (
              <div className="text-center py-6 sm:py-8">
                <div className="mb-4">
                  <SparklesIcon className="h-12 w-12 text-blue-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
                    No AI-matched jobs found for your query. Try refining your
                    search or using different keywords.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setAiQuery("");
                    resetStreamingSearch();
                  }}
                  variant="outline"
                  className="text-sm sm:text-base"
                >
                  Clear AI search
                </Button>
              </div>
            )}

          {!isAiMode && jobsData && jobsData.data.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
                No job postings found matching your criteria
              </p>
              <Button
                onClick={() => {
                  resetFilters();
                  setCurrentPage(1);
                }}
                variant="outline"
                className="text-sm sm:text-base"
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* Show pagination only for regular search mode */}
          {!isAiMode &&
            jobsData &&
            jobsData.data.length > 0 &&
            totalPages > 1 && (
              <div className="mt-6 sm:mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="gap-1 sm:gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => {
                          if (currentPage > 1) {
                            handlePageChange(currentPage - 1);
                          }
                        }}
                        className={`text-xs sm:text-sm ${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => {
                          if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        className={`text-xs sm:text-sm ${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

          {/* Show AI search results count */}
          {isAiMode && streamingState.jobs.length > 0 && (
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                <SparklesIcon className="inline h-4 w-4 mr-1 text-blue-500" />
                Found {streamingState.jobs.length} AI-matched jobs
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
