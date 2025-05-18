"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { authFetchCurrent } from "@/redux/action/userAction";
import { useDispatch, useSelector } from "react-redux";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(authFetchCurrent() as any);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (user.userType === "BUYER") {
        router.push("/buyer/dashboard");
      } else {
        router.push("/seller/dashboard");
      }
    }
  }, [user, isLoading, isInitializing, router]);

  if (isInitializing || isLoading ) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <div>{children}</div>;
}
