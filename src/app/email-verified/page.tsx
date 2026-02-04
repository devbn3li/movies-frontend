"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function EmailVerifiedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const success = searchParams.get("success");
    setIsSuccess(success === "true");
  }, [searchParams]);

  // Auto redirect countdown
  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSuccess, router]);

  if (isSuccess === null) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Email Verified Successfully! 🎉
        </h1>

        <p className="text-gray-400 text-center max-w-md mb-8">
          Your email has been verified. You can now access all features of your account.
        </p>

        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/profile")}
            className="px-6"
          >
            Go to Profile
          </Button>
          <Link href="/login">
            <Button variant="outline" className="px-6">
              Login
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          You will be redirected to login in {countdown} seconds...
        </p>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <XCircle className="w-12 h-12 text-red-500" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2 text-center">
        Verification Failed
      </h1>

      <p className="text-gray-400 text-center max-w-md mb-8">
        We couldn&apos;t verify your email. The link may have expired or is invalid.
      </p>

      <div className="flex gap-4">
        <Link href="/login">
          <Button className="px-6">
            Go to Login
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="px-6">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
    </div>
  );
}

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EmailVerifiedContent />
    </Suspense>
  );
}
