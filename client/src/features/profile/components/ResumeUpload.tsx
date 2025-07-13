import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { handleApiError } from "@/lib/errorHandler";
import { Upload, FileText, CheckCircle, X, Download } from "lucide-react";
import { toast } from "sonner";
import { useUploadResumeMutation, useGetResumeQuery } from "../resumeApi";

interface ResumeUploadProps {
  onUploadSuccess?: (url: string) => void;
  className?: string;
}

export function ResumeUpload({ onUploadSuccess, className }: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const { data: resumeData, refetch: refetchResume } = useGetResumeQuery();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      await uploadResume(formData).unwrap();
      toast.success("Resume uploaded successfully!");
      setSelectedFile(null);
      const updatedResume = await refetchResume();
      
      // Pass the resume URL to the callback
      if (updatedResume.data?.url) {
        onUploadSuccess?.(updatedResume.data.url);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadResume = () => {
    if (resumeData?.url) {
      window.open(resumeData.url, "_blank");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Resume Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Resume Display */}
        {resumeData?.url && (
          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Resume uploaded successfully
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResume}
                className="flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                View
              </Button>
            </div>
          </div>
        )}

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 dark:border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label htmlFor="resume-upload" className="cursor-pointer">
                <span className="text-primary hover:text-primary/80 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
              </Label>
              <Input
                id="resume-upload"
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PDF files only, up to 5MB
            </p>
          </div>
        </div>

        {/* Selected File Display */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}