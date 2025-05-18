"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { asFetchSellerBids } from "@/redux/action/projectAction";
import { Project } from "@/redux/reducers/projectReducer";

interface Bid {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  estimatedTime: string;
  message: string;
  createdAt: string;
  project: Project;
}

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    setLoading(true);
    const getBidsData = async () => {
      try {
        const bidsData = await dispatch(asFetchSellerBids() as any);
        setBids(bidsData);
      } catch (error) {console.log(error);}
      finally{
        setLoading(false);
      }
    };
    getBidsData();
  }, [dispatch]);

  const activeBids = bids.filter(
    (bid: Bid) => bid.project.status === "PENDING"
  );

  const activeProjects = bids.filter(
    (bid: Bid) => bid.project.status === "IN_PROGRESS"
  );

  const confirmProjects = bids.filter(
    (bid: Bid) => bid.project.status === "CONFIRM"
  );

  const completedProjects = bids.filter(
    (bid: Bid) => bid.project.status === "COMPLETED"
  );

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
          <Badge variant="outline" className="bg-blue-100 text-green-600 dark:bg-green-700 dark:text-green-200">
            Submited
          </Badge>
        )
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Manage your bids and track your active projects
          </p>
        </div>
        <Link href="/seller/projects">
          <Button className="gap-2">
            <Search className="h-4 w-4" />
            Find Projects
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBids.length}</div>
            <p className="text-xs text-muted-foreground">
              Bids awaiting buyer decision
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Projects currently in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Submited Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Projects currently Submited
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered projects
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Bids</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeBids.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No active bids</CardTitle>
                <CardDescription>
                  You don&apos;t have any active bids at the moment. Browse
                  available projects to place bids.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/seller/projects">
                  <Button>Find Projects</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeBids.map((bid: Bid) => (
                <Link
                  key={bid.project.id}
                  href={`/seller/projects/${bid.project.id}`}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{bid.project.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Budget: ₹{bid.project.budgetMin} - ₹
                            {bid.project.budgetMax}
                          </CardDescription>
                        </div>
                        {getStatusBadge(bid.project.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {bid.project.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Deadline: {formatDate(bid.project.deadline)}
                        </span>
                        <span>
                          Bid: ₹
                          {bids?.find((bid) => bid.sellerId === user?.id)
                            ?.amount || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeProjects.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No active projects</CardTitle>
                <CardDescription>
                  You don&apos;t have any active projects at the moment.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeProjects.map((bid: Bid) => (
                <Link
                  key={bid.project.id}
                  href={`/seller/projects/${bid.project.id}`}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{bid.project.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Budget: ₹{bid.project.budgetMin} - ₹
                            {bid.project.budgetMax}
                          </CardDescription>
                        </div>
                        {getStatusBadge(bid.project.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {bid.project.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Deadline: {formatDate(bid.project.deadline)}
                        </span>
                        <span>
                          Started: {formatDate(bid.project.updatedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Submited Projects</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : confirmProjects.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Submited projects</CardTitle>
                <CardDescription>
                  You don&apos;t have any Submited projects at the moment.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {confirmProjects.map((bid: Bid) => (
                <Link
                  key={bid.project.id}
                  href={`/seller/projects/${bid.project.id}`}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{bid.project.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Budget: ₹{bid.project.budgetMin} - ₹
                            {bid.project.budgetMax}
                          </CardDescription>
                        </div>
                        {getStatusBadge(bid.project.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {bid.project.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Deadline: {formatDate(bid.project.deadline)}
                        </span>
                        <span>
                          Started: {formatDate(bid.project.updatedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {completedProjects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recently Completed</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {completedProjects.slice(0, 4).map((bid: Bid) => (
                <Link
                  key={bid.project.id}
                  href={`/seller/projects/${bid.project.id}`}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{bid.project.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Budget: ₹{bid.project.budgetMin} - ₹
                            {bid.project.budgetMax}
                          </CardDescription>
                        </div>
                        {getStatusBadge(bid.project.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {bid.project.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Completed: {formatDate(bid.project.updatedAt)}
                        </span>
                        <span>
                          Deliverables: {bid.project.deliverables?.length || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
