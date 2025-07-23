import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  StopCircleIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
} from "lucide-react";
import { StreamingSearchState } from "../hooks/useStreamingAiSearch";
import { AiLoader } from "@/components/ui/ai-loader";

interface StreamingSearchProgressProps {
  state: StreamingSearchState;
  onStop: () => void;
  onReset: () => void;
}

export function StreamingSearchProgress({
  state,
  onStop,
  onReset,
}: StreamingSearchProgressProps) {
  const { isSearching, progress, status, error } = state;

  const getProgressColor = () => {
    if (error) return "bg-red-500";
    if (progress === 100) return "bg-green-500";
    return "bg-blue-500";
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
    if (progress === 100)
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    if (isSearching)
      return <AiLoader size="sm" showText={false} className="h-5 w-5" />;
    return <ClockIcon className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">
                {error
                  ? "Search Failed"
                  : progress === 100
                    ? "Search Completed"
                    : "AI Search in Progress"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {status || "Preparing search..."}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {isSearching && (
              <Button
                variant="outline"
                size="sm"
                onClick={onStop}
                className="flex items-center gap-2"
              >
                <StopCircleIcon className="h-4 w-4" />
                Stop
              </Button>
            )}

            {(progress === 100 || error) && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="flex items-center gap-2"
              >
                <SparklesIcon className="h-4 w-4" />
                New Search
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            className="h-2"
            // Apply custom color based on state
            style={
              {
                "--progress-background": error
                  ? "#ef4444"
                  : progress === 100
                    ? "#22c55e"
                    : "#3b82f6",
              } as React.CSSProperties
            }
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircleIcon className="h-4 w-4 text-red-600" />
              <h4 className="font-medium text-red-900">Error</h4>
            </div>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
