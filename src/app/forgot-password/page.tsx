"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EmailStep, VerifyCodeStep, NewPasswordStep } from "@/components/forgot-password";
import { useAuth } from "@/hooks/useAuth";

type Step = "email" | "verify" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, mounted } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");

  // Redirect authenticated users to home
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, router]);

  const handleEmailSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep("verify");
  };

  const handleVerifySuccess = (code: string) => {
    setResetCode(code);
    setStep("reset");
  };

  const handleBack = () => {
    setStep("email");
    setResetCode("");
  };

  // Don't render if checking auth or already authenticated
  if (!mounted || isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
      <div className="p-6 rounded w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step === "email" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}
            >
              {step === "email" ? "1" : "✓"}
            </div>
            <div className={`w-12 h-0.5 ${step !== "email" ? "bg-green-500" : "bg-gray-600"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step === "verify" ? "bg-blue-500 text-white" : step === "reset" ? "bg-green-500 text-white" : "bg-gray-600 text-gray-400"}`}
            >
              {step === "reset" ? "✓" : "2"}
            </div>
            <div className={`w-12 h-0.5 ${step === "reset" ? "bg-green-500" : "bg-gray-600"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step === "reset" ? "bg-blue-500 text-white" : "bg-gray-600 text-gray-400"}`}
            >
              3
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="flex justify-center">
          {step === "email" && <EmailStep onSuccess={handleEmailSuccess} />}
          {step === "verify" && (
            <VerifyCodeStep
              email={email}
              onSuccess={handleVerifySuccess}
              onBack={handleBack}
            />
          )}
          {step === "reset" && <NewPasswordStep email={email} resetCode={resetCode} />}
        </div>
      </div>

      <p className="text-sm mt-6">
        Remember your password?{" "}
        <Link href="/login" className="text-blue-500 hover:text-blue-400 underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
