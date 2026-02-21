import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--muted)] p-4">
      <div className="card max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--primary)]">
          <MailCheck size={32} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Check your email
        </h1>
        <p className="text-gray-600 mb-8">
          We sent a password reset link to your email address. Please check your
          inbox.
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="btn-primary w-full block text-center py-2.5"
          >
            Back to Login
          </Link>

          <div className="text-sm text-gray-600">
            Didn't receive the email?{" "}
            <Link
              href="/forgot-password"
              className="text-[var(--primary)] font-medium hover:underline"
            >
              Click to resend
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 text-sm"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
