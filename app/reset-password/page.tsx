"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Laravel usually sends ?token=...&email=... in the reset link
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success("Password has been reset!");
      router.push("/login"); // Redirect to login
    } catch (error: any) {
      console.error("Reset password error", error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--muted)] p-4">
      <div className="card max-w-md w-full">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--primary)]">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Please enter your new password below.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Hidden inputs to ensure we submit token/email if needed implicitly, though we send in JSON */}
          <input type="hidden" value={token} />
          <input type="hidden" value={email} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full block text-center py-2.5"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
