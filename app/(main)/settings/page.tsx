"use client";

import { User, Lock, Bell, Trash2 } from "lucide-react";
// ... (imports remain)
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async () => {
    if (passwords.password !== passwords.password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Common Laravel endpoint for password update
      // Try /user/password (Fortify) or /change-password (Custom)
      // We will try a custom route first as it's cleaner to define manually
      await api.post("/change-password", passwords);
      toast.success("Password updated successfully");
      setPasswords({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error: any) {
      console.error("Password update error", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Account Settings
      </h1>

      <div className="space-y-6">
        {/* Profile Section (Static for now) */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={20} /> Profile Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Alex Student"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="student@university.edu"
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                className="input-field h-24"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={20} /> Security
          </h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={passwords.current_password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={passwords.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={passwords.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
            <Trash2 size={20} /> Danger Zone
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-100 font-medium transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
