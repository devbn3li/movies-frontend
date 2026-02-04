"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VerifyCodeStepProps {
  email: string;
  onSuccess: (code: string) => void;
  onBack: () => void;
}

export default function VerifyCodeStep({ email, onSuccess, onBack }: VerifyCodeStepProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setCode(value);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-reset-code`, {
        email,
        resetCode: code,
      });
      onSuccess(code);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        email,
      });
      setMessage("New code sent to your email");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6) {
      const timer = setTimeout(() => {
        handleVerify();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Enter Verification Code</h2>
      <p className="text-gray-400 mb-6">
        We&apos;ve sent a 6-digit code to <span className="text-white font-medium">{email}</span>
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md text-sm">
            {message}
          </div>
        )}

        <Input
          type="text"
          placeholder="000000"
          value={code}
          onChange={handleCodeChange}
          maxLength={6}
          className="text-center text-2xl tracking-widest font-mono"
          required
          autoFocus
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading || code.length !== 6}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleResend}
            disabled={resendLoading || loading}
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </Button>
        </div>
      </form>

      <p className="text-sm text-gray-500 mt-6">
        Code expires in 10 minutes
      </p>
    </div>
  );
}
