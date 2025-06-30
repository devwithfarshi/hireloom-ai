import { toast } from 'sonner';

interface ApiError {
  status?: number;
  data?: {
    message?: string;
    error?: string;
  };
  error?: string;
}

/**
 * Handle API errors and display appropriate toast messages
 */
export const handleApiError = (error: ApiError) => {
  // Extract the error message from various possible locations
  const errorMessage =
    error?.data?.message ||
    error?.data?.error ||
    error?.error ||
    'An unexpected error occurred';

  // Display error toast
  toast.error(errorMessage);

  // Return the error message for potential further use
  return errorMessage;
};