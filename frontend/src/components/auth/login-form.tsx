"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setTokens } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const hasError = serverError !== null;

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (res.status === 401) {
        setServerError("Invalid email or password");
        return;
      }
      if (!res.ok) {
        setServerError("Login failed. Please try again.");
        return;
      }

      const result = await res.json();
      setTokens(result.access_token, result.refresh_token);
      router.push("/home");
    } catch {
      setServerError("Network error. Please check your connection.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Error alert — matches prototype exactly */}
      {hasError && (
        <div className="flex items-start gap-3 p-3 bg-danger-50 border border-red-200 rounded-lg mb-4">
          <svg
            className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-danger-700">{serverError}</p>
            <p className="text-xs text-red-600 mt-0.5">
              Please check your credentials and try again.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              hasError || errors.email
                ? "border-red-300 focus:ring-danger-500 focus:border-danger-500"
                : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-danger-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              hasError || errors.password
                ? "border-red-300 focus:ring-danger-500 focus:border-danger-500"
                : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            }`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-danger-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition mt-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Signing In…
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-5">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="text-primary-600 font-medium hover:text-primary-700"
        >
          Create one
        </a>
      </p>
    </div>
  );
}
