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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { JobList } from "../components/JobList";
import {
  EmploymentType,
  Job,
  useDeleteJobMutation,
  useGetCompanyJobsQuery,
} from "../jobApi";

export function JobDashboardPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [isRemoteFilter, setIsRemoteFilter] = useState<boolean | undefined>(undefined);

  const {
    data: jobsData,
    isLoading,
    refetch,
  } = useGetCompanyJobsQuery({
    search: searchTerm || undefined,
    employmentType: (employmentTypeFilter as EmploymentType) || undefined,
    active: activeFilter === "" ? undefined : activeFilter === "active",
    isRemote: isRemoteFilter,
  });

  const [deleteJob] = useDeleteJobMutation();

  const handleCreateJob = () => {
    navigate("/dashboard/jobs/create");
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

  const handleRefresh = () => {
    refetch();
    toast.success("Jobs refreshed");
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage your company's job postings
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="flex-1 sm:flex-none"
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button onClick={handleCreateJob} className="flex-1 sm:flex-none">
            <PlusIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Job</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      <Card className="mb-6 sm:mb-8">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Filters</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Filter job postings by title, employment type, and status
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
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
                  placeholder="Search by title"
                  className="pl-9 text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="employmentType"
                className="text-sm font-medium mb-1 block"
              >
                Employment Type
              </label>
              <Select
                value={employmentTypeFilter}
                onValueChange={(value) =>
                  setEmploymentTypeFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="employmentType" className="w-full text-sm sm:text-base">
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

            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium mb-1 block"
              >
                Status
              </label>
              <Select
                value={activeFilter}
                onValueChange={(value) =>
                  setActiveFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="status" className="w-full text-sm sm:text-base">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 flex items-center">
            <label htmlFor="isRemote" className="flex items-center cursor-pointer">
              <input
                id="isRemote"
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={isRemoteFilter === true}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsRemoteFilter(true);
                  } else if (isRemoteFilter === true) {
                    setIsRemoteFilter(undefined);
                  } else {
                    setIsRemoteFilter(true);
                  }
                }}
              />
              <span className="text-sm font-medium">Remote positions only</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-muted-foreground text-sm sm:text-base">Loading jobs...</p>
        </div>
      ) : (
        <JobList
          jobs={jobsData?.data || []}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
          isRecruiter={true}
        />
      )}

      {jobsData && jobsData.data.length === 0 && (
        <div className="text-center py-6 sm:py-8 px-4">
          <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">No job postings found</p>
          <Button 
            onClick={handleCreateJob} 
            variant="outline"
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Create your first job posting
          </Button>
        </div>
      )}
    </div>
  );
}
