"use client";

import { useRequireAuth, logout } from "@/hooks/use-auth";

export default function HomePage() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Authenticated navigation */}
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Placeholder home content */}
      <div className="max-w-5xl mx-auto px-6 pt-16">
        <div className="text-center max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success-50 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-success-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to Expense Manager!
          </h1>
          <p className="text-gray-500 mt-2">
            Your account is set up and ready to go. The dashboard, expense
            tracking, and budgeting features are coming soon.
          </p>
          <div className="mt-8 p-4 bg-primary-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-primary-700">
              🚀 This is a placeholder home screen. Future stories will add the
              dashboard, expense logging, and analytics here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
