"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Get pending verification data
    const pendingUserId = localStorage.getItem("pendingUserId");
    const pendingEmail = localStorage.getItem("pendingEmail");

    if (!pendingUserId) {
      // Redirect to registration if no pending verification
      router.push("/register");
      return;
    }

    setUserId(pendingUserId);
    setEmail(pendingEmail || "");
  }, [router]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and limit to 6 digits
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        userId: userId,
        verificationCode: verificationCode
      });

      setMessage("Email verified successfully!");
      
      // Store authentication token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Clear pending verification data
      localStorage.removeItem("pendingUserId");
      localStorage.removeItem("pendingEmail");
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, {
        userId: userId
      });

      setMessage("New verification code sent to your email");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (verificationCode.length === 6) {
      setTimeout(() => {
        handleVerify({ preventDefault: () => {} } as React.FormEvent);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationCode]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        
        <p className="text-gray-600 mb-6">
          {email 
            ? `We've sent a 6-digit verification code to ${email}`
            : "We've sent a 6-digit verification code to your email address"
          }
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={handleCodeChange}
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={loading}
            >
              Resend Code
            </Button>
          </div>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6">
          Didn&apos;t receive the code? Check your spam folder or click resend.
        </p>
      </div>
    </div>
  );
}
