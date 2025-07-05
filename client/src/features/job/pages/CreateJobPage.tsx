import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { JobForm } from "../components/JobForm";
import { useCreateJobMutation } from "../jobApi";
import { JobFormValues } from "../schemas";

export function CreateJobPage() {
  const navigate = useNavigate();
  const [createJob, { isLoading }] = useCreateJobMutation();

  const handleSubmit = async (values: JobFormValues) => {
    try {
      await createJob(values).unwrap();
      toast.success("Job created successfully");
      navigate("/dashboard/jobs");
    } catch (error: any) {
      console.error("Failed to create job:", error);
      toast.error(
        error?.data?.message || "Failed to create job. Please try again."
      );
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Job</CardTitle>
          <CardDescription>
            Fill in the details below to create a new job posting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
