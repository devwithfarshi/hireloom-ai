import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchAnalysis {
  score: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  matchAnalysis: MatchAnalysis;
  relevanceScore?: number;
}

export function AiAnalysisModal({
  isOpen,
  onClose,
  jobTitle,
  matchAnalysis,
  relevanceScore,
}: AiAnalysisModalProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5" />;
    if (score >= 60) return <TrendingUp className="h-5 w-5" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Poor Match";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80%] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              AI Analysis for {jobTitle}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Match Overview
              </h3>
              <div className="flex gap-3">
                {relevanceScore !== undefined && (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border font-medium ${getScoreColor(relevanceScore)}`}
                  >
                    {getScoreIcon(relevanceScore)}
                    <span>{relevanceScore}% Relevance</span>
                  </div>
                )}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border font-medium ${getScoreColor(matchAnalysis.score)}`}
                >
                  {getScoreIcon(matchAnalysis.score)}
                  <span>{matchAnalysis.score}% AI Score</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-sm px-3 py-1 ${getScoreColor(matchAnalysis.score)}`}
              >
                {getScoreLabel(matchAnalysis.score)}
              </Badge>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                AI Reasoning
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {matchAnalysis.reasoning}
            </p>
          </div>

          {/* Strengths */}
          {matchAnalysis.strengths.length > 0 && (
            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Strengths
                </h3>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-300"
                >
                  {matchAnalysis.strengths.length}{" "}
                  {matchAnalysis.strengths.length === 1
                    ? "strength"
                    : "strengths"}
                </Badge>
              </div>
              <ul className="space-y-3">
                {matchAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-800 leading-relaxed">
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {matchAnalysis.weaknesses.length > 0 && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">
                  Areas of Concern
                </h3>
                <Badge
                  variant="outline"
                  className="bg-red-100 text-red-700 border-red-300"
                >
                  {matchAnalysis.weaknesses.length}{" "}
                  {matchAnalysis.weaknesses.length === 1
                    ? "concern"
                    : "concerns"}
                </Badge>
              </div>
              <ul className="space-y-3">
                {matchAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800 leading-relaxed">
                      {weakness}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {matchAnalysis.recommendations.length > 0 && (
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-800">
                  Recommendations
                </h3>
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-700 border-amber-300"
                >
                  {matchAnalysis.recommendations.length}{" "}
                  {matchAnalysis.recommendations.length === 1
                    ? "recommendation"
                    : "recommendations"}
                </Badge>
              </div>
              <ul className="space-y-3">
                {matchAnalysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-amber-800 leading-relaxed">
                      {recommendation}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
