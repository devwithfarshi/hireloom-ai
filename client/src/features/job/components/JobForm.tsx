import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseIcon, ClockIcon, MapPinIcon, TagIcon } from "lucide-react";
import React from "react";
import { Resolver, useForm } from "react-hook-form";
import { EmploymentType } from "../jobApi";
import { JobFormValues, jobFormSchema } from "../schemas";

interface JobFormProps {
  initialValues?: Partial<JobFormValues>;
  onSubmit: (values: JobFormValues) => void;
  isLoading?: boolean;
  title?: string;
}

export function JobForm({
  initialValues,
  onSubmit,
  isLoading,
  title = "Create Job Listing",
}: JobFormProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema) as Resolver<JobFormValues>,
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      location: initialValues?.location || "",
      employmentType: initialValues?.employmentType || EmploymentType.FULL_TIME,
      experience: initialValues?.experience || 0,
      tags: initialValues?.tags || [],
      active: initialValues?.active !== undefined ? initialValues.active : true,
      isRemote: initialValues?.isRemote !== undefined ? initialValues.isRemote : false,
    },
  });

  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(initialValues?.tags || []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const onFormSubmit = (values: JobFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6"
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4" />
                      Job Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Senior Frontend Developer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Describe the job responsibilities, requirements, and benefits..."
                        error={!!form.formState.errors.description}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. New York, NY or Remote"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <BriefcaseIcon className="h-4 w-4" />
                        Employment Type
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        Experience (years)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="e.g. 3"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4" />
                      Skills & Technologies
                    </FormLabel>
                    <div className="flex gap-2">
                      <Input
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
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="secondary"
                        size="icon"
                      >
                        <TagIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Add relevant skills and technologies for this position
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          <span>{tag}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="text-muted-foreground hover:text-destructive ml-1"
                                >
                                  ×
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove tag</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Badge>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Listing
                        </FormLabel>
                        <FormDescription>
                          Toggle to make this job visible to candidates
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isRemote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Remote Position
                        </FormLabel>
                        <FormDescription>
                          Toggle if this job can be done remotely
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6"
              size="lg"
            >
              {isLoading ? "Saving..." : "Save Job Listing"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
