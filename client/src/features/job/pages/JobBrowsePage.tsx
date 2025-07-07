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
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { JobList } from "../components/JobList";
import { EmploymentType, useGetJobsQuery } from "../jobApi";
import { useFilterDebounce } from "../hooks/useFilterDebounce";

export function JobBrowsePage() {
  // Use the custom hook for all filter inputs with debounce
  const {
    inputValues,
    debouncedValues,
    setSearch,
    setLocation,
    setEmploymentType,
    setIsRemote,
    resetFilters
  } = useFilterDebounce();
  
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const {
    data: jobsData,
    isLoading,
    isFetching,
  } = useGetJobsQuery({
    search: debouncedValues.search || undefined,
    employmentType: (debouncedValues.employmentType as EmploymentType) || undefined,
    location: debouncedValues.location || undefined,
    active: true, // Only show active jobs
    isRemote: debouncedValues.isRemote || undefined,
    page: currentPage,
    limit,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground mt-1">
          Browse through available job opportunities
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Jobs</CardTitle>
          <CardDescription>
            Filter jobs by title, location, and employment type
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
                  placeholder="Search by job title"
                  className="pl-9"
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
                value={inputValues.location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setCurrentPage(1); // Reset to first page on location change
                }}
              />
            </div>

            <div>
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
          </div>
          
          <div className="mt-4 flex items-center">
            <label htmlFor="isRemote" className="flex items-center cursor-pointer">
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
              <span className="text-sm font-medium">Remote positions only</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {isLoading || isFetching ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      ) : (
        <>
          <JobList jobs={jobsData?.data || []} />

          {jobsData && jobsData.data.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No job postings found matching your criteria
              </p>
              <Button
                onClick={() => {
                  resetFilters();
                  setCurrentPage(1);
                }}
                variant="outline"
              >
                Clear filters
              </Button>
            </div>
          )}

          {jobsData && jobsData.data.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
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
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
