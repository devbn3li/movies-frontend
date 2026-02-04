"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      document.cookie = `token=${res.data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Check if email verification is required
      if (err.response?.data?.requiresVerification) {
        localStorage.setItem("pendingUserId", err.response.data.userId);

        const goToVerification = confirm("Please verify your email first. Would you like to verify now?");
        if (goToVerification) {
          router.push("/verify-email");
        }
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
      <form onSubmit={handleSubmit} className="p-6 rounded w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Input
          type="email"
          className="w-full p-2 border mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          className="w-full p-2 border mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end mb-3">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-500 hover:text-blue-400 underline"
          >
            Forgot Password?
          </Link>
        </div>
        <Button
          className="w-full py-2 border"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <p className="text-sm mt-3">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600 underline">
          Register here
        </Link>
      </p>

    </div>
  );
}
