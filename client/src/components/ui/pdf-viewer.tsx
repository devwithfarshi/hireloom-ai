import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/**
 * PDFViewer Component
 *
 * A comprehensive PDF viewer with navigation, zoom controls, and download functionality.
 * Features:
 * - Page navigation (previous/next)
 * - Zoom in/out controls (50% to 200%)
 * - Download functionality
 * - Loading states and error handling
 * - Responsive design
 *
 * @param url - The URL of the PDF file to display
 * @param className - Optional CSS classes for styling
 * @param height - Height of the viewer in pixels (default: 600)
 */

interface PDFViewerProps {
  url: string;
  className?: string;
  height?: number;
}

export function PDFViewer({ url, className, height = 600 }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    // Try iframe fallback for CORS issues
    setUseIframe(true);
    setLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error && !useIframe) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-8 border rounded-lg",
          className
        )}
      >
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={downloadPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        {!useIframe ? (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {loading ? "Loading..." : `${pageNumber} of ${numPages}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">
              PDF Viewer (Fallback Mode)
            </span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {!useIframe && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 2.0}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div
        className="overflow-auto bg-gray-100 flex justify-center"
        style={{ height: `${height}px` }}
      >
        {loading && !useIframe && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}

        {useIframe ? (
          <div className="w-full h-full">
            <iframe
              src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          </div>
        ) : (
          <Document
            file={{
              url: url,
            }}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="flex justify-center"
            options={{
              cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
              cMapPacked: true,
              standardFontDataUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
            }}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="shadow-lg"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        )}
      </div>
    </div>
  );
}
