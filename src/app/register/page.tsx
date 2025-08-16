"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { getCountries } from "@/data/countries-cities";
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  });
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countries = await getCountries();
        setAvailableCountries(countries);
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (value: string) => {
    setForm({ ...form, country: value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/register", form);
      
      // Check if email verification is required
      if (res.data.requiresVerification) {
        // Store verification data
        localStorage.setItem("pendingUserId", res.data.userId);
        localStorage.setItem("pendingEmail", res.data.email);
        
        // Redirect to verification page
        router.push("/verify-email");
      } else {
        // Direct login (if no verification required)
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 rounded w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <Input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 border mb-3"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="mb-3">
          <Select onValueChange={handleCountryChange} value={form.country}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select your country"} />
            </SelectTrigger>
            <SelectContent>
              {availableCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="py-2 px-4 w-full"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
