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
    <div className="container mx-auto max-w-4xl py-8">
      <JobForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        title="Create New Job"
      />
    </div>
  );
}
