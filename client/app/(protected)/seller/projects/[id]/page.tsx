"use client";

import type React from "react";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Upload,
  Download,
  FileIcon,
  X,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  asCreateBid,
  asFetchProjectById,
  asUpdateProjectStatusBySeller,
  asUploadDeliverables,
} from "@/redux/action/projectAction";
import { toast } from "sonner";
import { Bid } from "@/redux/reducers/projectReducer";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const bidFormSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Bid amount must be positive" }),
  estimatedDuration: z.coerce.number().positive({
    message: "Please provide an positive estimated completion time in days",
  }),
  message: z
    .string()
    .min(20, { message: "Message must be at least 20 characters" }),
});

type BidFormValues = z.infer<typeof bidFormSchema>;

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentProject, isLoading } = useSelector(
    (state: any) => state.projects
  );
  const { user } = useSelector((state: any) => state.user);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(asFetchProjectById(id as string) as any);
    }
  }, [dispatch, id]);

  const bidForm = useForm<BidFormValues>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      amount: 0,
      estimatedDuration: 1,
      message: "",
    },
  });

  const onBidSubmit = (data: BidFormValues) => {
    dispatch(asCreateBid(id as string, data) as any);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadDeliverables = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }

      await dispatch(asUploadDeliverables(id as string, formData) as any);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCompleteProject = async () => {
    setIsUploading(true);
    try {
      await dispatch(asUpdateProjectStatusBySeller(id as string) as any);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          >
            Pending
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            In Progress
          </Badge>
        );
      case "CONFIRM":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-green-600 dark:bg-green-700 dark:text-green-200"
          >
            Submited
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Check if the current user has already bid on this project
  const userBid = currentProject?.bids?.find(
    (bid: Bid) => bid.sellerId === user?.id
  );

  // Check if the current user is the selected seller for this project
  const isSelectedSeller = currentProject?.sellerId === user?.id;

  if (!currentProject) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{currentProject.title}</h1>
        <div className="ml-auto">{getStatusBadge(currentProject.status)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Posted on {formatDate(currentProject.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {currentProject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Budget Range</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{currentProject.budgetMin} - ₹{currentProject.budgetMax}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Deadline</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(currentProject.deadline)}
                  </p>
                </div>
              </div>
            </CardContent>
            {currentProject.status === "IN_PROGRESS" && (
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Submited
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Mark project as Submited?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will mark the project as Submited. Make sure
                        you have reviewed all deliverables and are satisfied
                        with the work.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCompleteProject}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Confirm"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            )}
          </Card>

          {currentProject.status === "PENDING" && !userBid && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Place Your Bid</CardTitle>
                <CardDescription>
                  Submit your proposal to work on this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...bidForm}>
                  <form
                    onSubmit={bidForm.handleSubmit(onBidSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={bidForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bid Amount (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your proposed price for completing this project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bidForm.control}
                      name="estimatedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Completion Time</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              placeholder="e.g. 10 days"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            How long you expect it will take to complete the
                            project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bidForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Explain why you're the right fit for this project..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Highlight your relevant skills and experience for
                            this project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Bid"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {userBid && currentProject.status === "PENDING" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Bid</CardTitle>
                <CardDescription>
                  You have already placed a bid on this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Bid Amount</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{userBid.amount}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">
                    Estimated Completion Time
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userBid.estimatedTime}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Your Message</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {userBid.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {isSelectedSeller &&
            currentProject.status === "COMPLETED" &&
            currentProject.deliverables &&
            currentProject.deliverables.length === 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Upload Deliverables</CardTitle>
                  <CardDescription>
                    Upload files and resources for the buyer to review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleUploadDeliverables}
                    className="space-y-4"
                  >
                    <div className="grid w-full items-center gap-1.5">
                      <label
                        htmlFor="file-upload"
                        className="text-sm font-medium"
                      >
                        Select Files
                      </label>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        You can select multiple files to upload
                      </p>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Selected Files</p>
                        <div className="rounded-md border border-border p-2">
                          <ul className="space-y-2">
                            {selectedFiles.map((file, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between rounded-md bg-muted/50 p-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <FileIcon className="h-4 w-4" />
                                  <span className="text-sm truncate max-w-[200px]">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isUploading || selectedFiles.length === 0}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Deliverables
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

          {currentProject.status === "COMPLETED" &&
            currentProject.deliverables &&
            currentProject.deliverables.length > 0 &&
            currentProject.rating && (
              <Card className="mt-6">
                <CardHeader className="font-semibold text-lg">
                  <CardTitle>Your Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium mr-2">Score:</span>
                    {currentProject?.rating &&
                      [...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${
                            i + 1 <= currentProject?.rating?.score
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted-foreground"
                          }`}
                        />
                      ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({currentProject?.rating?.score}/5)
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Comment:</span>
                    <p className="text-sm p-3 border rounded-md">
                      {currentProject?.rating?.comment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

          {isSelectedSeller &&
            currentProject.status === "COMPLETED" &&
            currentProject.deliverables &&
            currentProject.deliverables.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Uploaded Deliverables</CardTitle>
                  <CardDescription>
                    Files and resources you delivered for this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentProject.deliverables.map(
                      (deliverable: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded-md"
                        >
                          <span className="text-sm truncate">
                            {deliverable.split("/").pop()}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={deliverable}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Link>
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">Created</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(currentProject.createdAt)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full ${
                      currentProject.status !== "PENDING"
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-gray-100 dark:bg-gray-800"
                    } flex items-center justify-center`}
                  >
                    {currentProject.status !== "PENDING" ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">In Progress</h3>
                    {currentProject.status !== "PENDING" && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(currentProject.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full ${
                      currentProject.status === "COMPLETED"
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-gray-100 dark:bg-gray-800"
                    } flex items-center justify-center`}
                  >
                    {currentProject.status === "COMPLETED" ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">Completed</h3>
                    {currentProject.status === "COMPLETED" && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(currentProject.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentProject.status === "PENDING" && !userBid && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This project was posted on{" "}
                  {formatDate(currentProject.createdAt)} and has a deadline of{" "}
                  {formatDate(currentProject.deadline)}.
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium">Time Remaining:</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentProject.deadline) > new Date()
                      ? `${Math.ceil(
                          (new Date(currentProject.deadline).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : "Deadline passed"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
