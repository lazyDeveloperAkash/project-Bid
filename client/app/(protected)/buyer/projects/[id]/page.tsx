"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Loader2,
  SendHorizonal,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  asFetchProjectById,
  asSelectSeller,
  asUpdateProjectStatus,
} from "@/redux/action/projectAction";
import { Bid } from "@/redux/reducers/projectReducer";
import { Textarea } from "@/components/ui/textarea";
import { asUploadReview } from "@/redux/action/reviewAction";
import ProjectDetailsSkeleton from "@/components/skeleton/buyer/ProjectDetailsSkeleton"

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentProject, isLoading } = useSelector(
    (state: any) => state.projects
  );
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (id) {
      dispatch(asFetchProjectById(id as string) as any);
    }
  }, [dispatch, id]);

  const handleSelectSeller = async () => {
    if (!selectedBidId || !id) return;

    try {
      const resultAction = await dispatch(
        asSelectSeller(id as string, selectedBidId) as any
      );

      if (resultAction) toast.success("Seller selected successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to select seller");
    }
  };

  const handleCompleteProject = () => {
    dispatch(asUpdateProjectStatus(id as string) as any);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleReviewSubmit = async () => {
    // Here you would implement the API call to submit the review

    try {
      const reviewData = {
        score: rating,
        comment,
      };

      await dispatch(asUploadReview(id as string, reviewData) as any);

      setRating(0);
      setComment("");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || "something went wrong");
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

  if (!currentProject) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <ProjectDetailsSkeleton/>
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
                Created on {formatDate(currentProject.createdAt)}
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

              {currentProject.status === "IN_PROGRESS" && (
                <div>
                  <h3 className="font-medium mb-1">Selected Seller</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {currentProject.bids?.find(
                      (bid: Bid) => bid.sellerId === currentProject.sellerId
                    )?.seller?.name ||
                      currentProject?.seller?.name ||
                      "Unknown"}
                  </p>
                </div>
              )}
            </CardContent>
            {currentProject.status === "CONFIRM" && (
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Mark project as completed?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will mark the project as completed. Make
                        sure you have reviewed all deliverables and are
                        satisfied with the work.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCompleteProject}
                        disabled={isLoading}
                      >
                        {isLoading ? (
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

          {currentProject.status === "PENDING" &&
            currentProject.bids &&
            currentProject.bids.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Bids ({currentProject.bids.length})</CardTitle>
                  <CardDescription>
                    Select a seller to start working on your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentProject.bids.map((bid: Bid) => (
                      <div key={bid.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{bid?.seller?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Bid Amount: ₹{bid.amount}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {bid.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-4">{bid.message}</p>
                        <div className="flex justify-end">
                          <Button
                            variant={
                              selectedBidId === bid.id ? "default" : "outline"
                            }
                            onClick={() => setSelectedBidId(bid.id)}
                          >
                            {selectedBidId === bid.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={!selectedBidId}
                    onClick={handleSelectSeller}
                  >
                    Confirm Selection
                  </Button>
                </CardFooter>
              </Card>
            )}

          {currentProject.status === "COMPLETED" &&
            currentProject.deliverables &&
            currentProject.deliverables.length > 0 &&
            (currentProject.rating ? (
              <Card className="mt-6">
                <CardHeader className="font-semibold text-lg">
                  <CardTitle>Your Review</CardTitle>
                  <p></p>
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
            ) : (
              <Card className="mt-6">
                <CardHeader className="flex flex-col gap-1 font-semibold text-lg">
                  Rate & Write Review for {currentProject?.title || "Project"}
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex gap-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted-foreground"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold">Review</h4>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here..."
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    onClick={handleReviewSubmit}
                    disabled={rating === 0 || comment === ""}
                  >
                    Post Review
                    <SendHorizonal className="text-white text-sm ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

          {currentProject.status === "COMPLETED" &&
            currentProject.deliverables &&
            currentProject.deliverables.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Deliverables</CardTitle>
                  <CardDescription>
                    Files and resources delivered by the seller
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

          {currentProject.status === "PENDING" &&
            currentProject.bids &&
            currentProject.bids.length === 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>No Bids Yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your project hasn&apos;t received any bids yet. Check back
                    later or consider updating your project details to attract
                    more sellers.
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
