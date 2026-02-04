"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";

function VerifyEmailLinkContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const verifyEmail = async () => {
      try {
        // Call backend API to verify email
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email-link?token=${token}`
        );

        // Redirect to success page
        router.replace("/email-verified?success=true");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
          "Failed to verify email. The link may have expired."
        );
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold text-white">Verifying your email...</h2>
        <p className="text-gray-400 mt-2">Please wait a moment</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
        <p className="text-gray-400 text-center max-w-md mb-6">{message}</p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return null;
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
      <h2 className="text-xl font-semibold text-white">Loading...</h2>
    </div>
  );
}

export default function VerifyEmailLinkPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailLinkContent />
    </Suspense>
  );
}
