import { cn } from "@/lib/utils";
import { forwardRef, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "link",
];

// Use forwardRef with explicit typing for the ref parameter
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    { value, onChange, placeholder, className, error },
    ref: React.Ref<HTMLDivElement>
  ) => {
    // Use any type for quillRef as ReactQuill's type is complex
    const quillRef = useRef<any>(null);

    return (
      <div className={cn("w-full", className)} ref={ref}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className={cn(
            "bg-background rounded-md",
            error ? "border-destructive" : "border-input"
          )}
        />
      </div>
    );
  }
);
