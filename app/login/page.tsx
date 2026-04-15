"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      // Assuming response.data.token exists based on typical patterns
      // Adjust according to actual API response structure
      const token = response.data.token || response.data.access_token;
      const user = response.data.user; // Assuming user object is returned

      if (token) {
        localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          // Role: 0 = Student, 2 = Lecturer
          if (user.role === 2) {
            router.push("/lecturer-dashboard");
          } else {
            router.push("/dashboard");
          }
        } else {
          // Fallback if user not in response (should fetch /auth/me or similar, but for now default to dashboard)
          router.push("/dashboard");
        }
        toast.success("Login successful!");
      } else {
        toast.error("Login failed: No token received");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
      {/* Right Side - Visual (Background on Mobile, Right Side on Desktop) */}
      <div className="absolute inset-0 md:relative md:flex-1 bg-[var(--secondary)] flex items-center justify-center p-12 z-0">
        <div className="max-w-lg text-center hidden md:block">
          <div className="w-64 h-64 bg-white rounded-full mx-auto mb-8 flex items-center justify-center shadow-sm">
            <span className="text-6xl">👋</span>
          </div>
          <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">
            Ready to study smarter?
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands of students organizing their learning journey with
            StudyMate.
          </p>
        </div>
        {/* Mobile Background Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm md:hidden"></div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 py-12 z-10 relative w-full md:w-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-200 md:text-gray-500 hover:text-white md:hover:text-gray-900 mb-8 w-fit transition-colors"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <div className="max-w-md w-full mx-auto bg-white/90 md:bg-white p-8 md:p-0 rounded-2xl shadow-xl md:shadow-none backdrop-blur-md md:backdrop-blur-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600 mb-8">
            Please enter your details to sign in.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="student@university.edu"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full block text-center py-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
