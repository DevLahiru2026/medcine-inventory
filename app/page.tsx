"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("hashawijesekara@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check credentials
    const defaultEmail = "hashawijesekara@gmail.com";
    const defaultPassword = "helloworld";

    if (email === defaultEmail && password === defaultPassword) {
      // Show success message
      setSuccess(true);

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/admin/medicine?login=success");
      }, 1500);
    } else {
      // Show error message
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side - Background Image with Text */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern/Image */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-8 xl:px-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border-2 border-white/30">
                  <div className="text-5xl">🏥</div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-2xl">💊</div>
                </div>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4 lg:space-y-6 max-w-md">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              Dr.Hashini Wijesekara Medical Center
            </h1>
            <p className="text-lg lg:text-xl font-medium text-blue-100">
              Medicine Inventory Management System
            </p>
            <p className="text-sm lg:text-base text-blue-100 leading-relaxed">
              Efficiently manage your medicine stock, track inventory, process GRN, and issue medications with ease.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 lg:mt-12 flex gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold">500+</div>
              <div className="text-blue-200 text-xs lg:text-sm">Medicines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold">100%</div>
              <div className="text-blue-200 text-xs lg:text-sm">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold">24/7</div>
              <div className="text-blue-200 text-xs lg:text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Only visible on small screens */}
          <div className="lg:hidden mb-6 sm:mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center">
                <div className="text-2xl">🏥</div>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Medical Center</h2>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-sm sm:text-base text-gray-600">Please login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Login successful! Redirecting...</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 sm:hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
