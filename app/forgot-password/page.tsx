"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { useState, FormEvent } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/forgot-password", { email });
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error: any) {
      console.error("Forgot password error", error);
      toast.error(
        error.response?.data?.message || "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--muted)] p-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-gray-600 mb-6">
            We have sent a password reset link to{" "}
            <span className="font-semibold">{email}</span>.
          </p>
          <Link href="/login" className="btn-primary w-full block py-2.5">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--muted)] p-4">
      <div className="card max-w-md w-full">
        <Link
          href="/login"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 w-fit text-sm"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--primary)]">
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot password?
          </h1>
          <p className="text-gray-600 text-sm">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full block text-center py-2.5"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
