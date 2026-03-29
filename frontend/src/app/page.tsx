"use client";

import Link from "next/link";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth";

export default function LandingPage() {
  const { checking } = useRedirectIfAuthenticated();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">Expense Manager</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Take control of your
            <br />
            <span className="text-primary-600">spending</span>
          </h1>
          <p className="text-lg text-gray-500 mt-4">
            Track expenses, set budgets, and gain insights into your financial
            habits — all in one simple app.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link
              href="/register"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Track Expenses</h3>
            <p className="text-sm text-gray-500 mt-1">
              Log expenses with categories, notes, and receipt photos in seconds.
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Set Budgets</h3>
            <p className="text-sm text-gray-500 mt-1">
              Set monthly and per-category budgets with smart alerts at key
              thresholds.
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-500 mt-1">
              Visualize spending patterns with charts and category breakdowns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
