"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("0"); // Default to Student (0). Lecturer is 2.
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // Register usually implies login, or redirect to login.
      // Based on typical flows, we'll try to register, then check if we get a token or need to login.
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        role: parseInt(role),
      });

      const token = response.data.token || response.data.access_token;
      const user = response.data.user;

      if (token) {
        localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Account created! Logging in...");

          if (user.role === 2) {
            router.push("/lecturer-dashboard");
          } else {
            router.push("/dashboard");
          }
        } else {
          // Fallback if user object is missing (though backend guarantees it)
          router.push("/dashboard");
        }
      } else {
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg = err.response?.data?.message || "Failed to create account";
      setError(msg);
      toast.error(msg);
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
            <span className="text-6xl">🚀</span>
          </div>
          <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">
            Your AI Study Partner
          </h2>
          <p className="text-gray-600 text-lg">
            Generate summaries, flashcards, and quizzes from your notes in
            seconds.
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
            Create an account
          </h1>
          <p className="text-gray-600 mb-8">
            Start organizing your study materials today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Student"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <input
                type="password"
                placeholder="Create a password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a...
              </label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                  <input
                    type="radio"
                    name="role"
                    value="0"
                    checked={role === "0"}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                  <input
                    type="radio"
                    name="role"
                    value="2"
                    checked={role === "2"}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span>Lecturer</span>
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
