import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { EmploymentType } from "../jobApi";
import { JobFormValues, jobFormSchema } from "../schemas";

interface JobFormProps {
  initialValues?: Partial<JobFormValues>;
  onSubmit: (values: JobFormValues) => void;
  isLoading?: boolean;
}

export function JobForm({ initialValues, onSubmit, isLoading }: JobFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema) as Resolver<JobFormValues>,
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      location: initialValues?.location || "",
      employmentType: initialValues?.employmentType || EmploymentType.FULL_TIME,
      experience: initialValues?.experience || 0,
      tags: initialValues?.tags || [],
      active: initialValues?.active !== undefined ? initialValues.active : true,
    },
  });

  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(initialValues?.tags || []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFormSubmit = (values: JobFormValues) => {
    // Include the tags from the state
    const formData = { ...values, tags };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="e.g. Senior Frontend Developer"
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-destructive text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Job Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Describe the job responsibilities, requirements, and benefits..."
                error={!!errors.description}
              />
            )}
          />
          {errors.description && (
            <p className="text-destructive text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="e.g. New York, NY or Remote"
            className={errors.location ? "border-destructive" : ""}
          />
          {errors.location && (
            <p className="text-destructive text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="employmentType">Employment Type</Label>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={errors.employmentType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmploymentType.FULL_TIME}>
                    Full Time
                  </SelectItem>
                  <SelectItem value={EmploymentType.PART_TIME}>
                    Part Time
                  </SelectItem>
                  <SelectItem value={EmploymentType.CONTRACT}>
                    Contract
                  </SelectItem>
                  <SelectItem value={EmploymentType.FREELANCE}>
                    Freelance
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.employmentType && (
            <p className="text-destructive text-sm mt-1">
              {errors.employmentType.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="experience">Experience (years)</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            {...register("experience", { valueAsNumber: true })}
            placeholder="e.g. 3"
            className={errors.experience ? "border-destructive" : ""}
          />
          {errors.experience && (
            <p className="text-destructive text-sm mt-1">
              {errors.experience.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. React, TypeScript"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-muted text-muted-foreground px-2 py-1 rounded-md flex items-center gap-1"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="active"
              />
            )}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
