import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { EmploymentType, Job } from "../jobApi";
import { useAuth } from "@/features/auth/hooks";
import { Role } from "@/features/auth/types";
import { Eye, Users, Edit, Trash2, Sparkles, Brain, TrendingUp, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

interface JobListProps {
  jobs: Job[];
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  isRecruiter?: boolean;
  isAiMode?: boolean;
}

// Extended interface for AI results
interface AiJob extends Job {
  relevanceScore?: number;
  matchAnalysis?: {
    score: number;
    reasoning: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  queryRelevance?: number;
}

const formatEmploymentType = (type: EmploymentType): string => {
  switch (type) {
    case EmploymentType.FULL_TIME:
      return "Full Time";
    case EmploymentType.PART_TIME:
      return "Part Time";
    case EmploymentType.CONTRACT:
      return "Contract";
    case EmploymentType.FREELANCE:
      return "Freelance";
    default:
      return type;
  }
};

export function JobList({
  jobs,
  onEdit,
  onDelete,
  isRecruiter = false,
  isAiMode = false,
}: JobListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userIsRecruiter = user?.role === Role.RECRUITER;

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No jobs found</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <TrendingUp className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => {
        const aiJob = job as AiJob;
        const hasAiData = isAiMode && (aiJob.relevanceScore !== undefined || aiJob.matchAnalysis);
        
        return (
          <Card 
            key={job.id} 
            className={`flex flex-col transition-all duration-300 ${
              hasAiData 
                ? 'bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 border-blue-200/60 shadow-lg hover:shadow-xl hover:border-blue-300/80' 
                : ''
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="line-clamp-2">{job.title}</CardTitle>
                    {hasAiData && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                        <Brain className="h-3 w-3 text-purple-500" />
                      </div>
                    )}
                  </div>
                  <CardDescription className="mt-1">
                    {job.company?.name || "Company"} • {job.location}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!job.active && (
                    <Badge
                      variant="outline"
                      className="bg-muted text-muted-foreground"
                    >
                      Inactive
                    </Badge>
                  )}
                  {hasAiData && aiJob.relevanceScore !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getScoreColor(aiJob.relevanceScore)}`}>
                      {getScoreIcon(aiJob.relevanceScore)}
                      <span>{aiJob.relevanceScore}% Match</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {formatEmploymentType(job.employmentType)}
                  </Badge>
                  <Badge variant="secondary">
                    {job.experience} {job.experience === 1 ? "year" : "years"}
                  </Badge>
                  {job.isRemote && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                      Remote
                    </Badge>
                  )}
                  {job.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {job.tags.length > 3 && (
                    <Badge variant="outline">+{job.tags.length - 3}</Badge>
                  )}
                </div>
                
                <div
                  className="text-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html:
                      job.description.replace(/<[^>]*>/g, " ").substring(0, 150) +
                      "...",
                  }}
                />
                
                {/* AI Analysis Section */}
                {hasAiData && aiJob.matchAnalysis && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-800">AI Analysis</span>
                      <div className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(aiJob.matchAnalysis.score)}`}>
                        {getScoreIcon(aiJob.matchAnalysis.score)}
                        <span>{aiJob.matchAnalysis.score}% AI Score</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-700 line-clamp-2 mb-2">
                      {aiJob.matchAnalysis.reasoning}
                    </div>
                    
                    {/* Strengths */}
                    {aiJob.matchAnalysis.strengths.length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-green-800">Strengths</span>
                        </div>
                        <div className="text-xs text-green-700 line-clamp-1">
                          {aiJob.matchAnalysis.strengths[0]}
                        </div>
                        {aiJob.matchAnalysis.strengths.length > 1 && (
                          <span className="text-xs text-green-600">+{aiJob.matchAnalysis.strengths.length - 1} more</span>
                        )}
                      </div>
                    )}
                    
                    {/* Recommendations */}
                    {aiJob.matchAnalysis.recommendations.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Lightbulb className="h-3 w-3 text-amber-600" />
                          <span className="text-xs font-medium text-amber-800">Recommendation</span>
                        </div>
                        <div className="text-xs text-amber-700 line-clamp-1">
                          {aiJob.matchAnalysis.recommendations[0]}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t pt-4">
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
              {(isRecruiter || userIsRecruiter) && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Applicants
                </Button>
              )}
            </div>
            {(isRecruiter || userIsRecruiter) && (onEdit || onDelete) && (
              <div className="flex w-full gap-2">
                {onEdit && (
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => onEdit(job)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => onDelete(job.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
