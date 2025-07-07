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
import { PlusIcon, SearchIcon } from "lucide-react";
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's job postings
          </p>
        </div>
        <Button onClick={handleCreateJob}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter job postings by title, employment type, and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  placeholder="Search by title"
                  className="pl-9"
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
                <SelectTrigger id="employmentType" className="w-full">
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
                <SelectTrigger id="status" className="w-full">
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
          
          <div className="mt-4 flex items-center">
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
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading jobs...</p>
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
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No job postings found</p>
          <Button onClick={handleCreateJob} variant="outline">
            Create your first job posting
          </Button>
        </div>
      )}
    </div>
  );
}
