import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { JobForm } from "../components/JobForm";
import { useGetJobByIdQuery, useUpdateJobMutation } from "../jobApi";
import { JobFormValues } from "../schemas";

export function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading: isLoadingJob, error } = useGetJobByIdQuery(id!);
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const handleSubmit = async (values: JobFormValues) => {
    if (!id) return;

    try {
      await updateJob({ id, ...values }).unwrap();
      toast.success("Job updated successfully");
      navigate("/dashboard/jobs");
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error("Failed to update job. Please try again.");
    }
  };

  if (isLoadingJob) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading job details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive">
                Failed to load job details. Please try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Job</CardTitle>
          <CardDescription>
            Update the details of your job posting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm
            initialValues={job}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
}
