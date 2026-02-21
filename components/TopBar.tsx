"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Home,
  AlertCircle,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface TopBarProps {
  title?: string;
  onMenuClick: () => void;
}

const TopBar = ({ title, onMenuClick }: TopBarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<{ name: string; username?: string } | null>(
    null,
  );
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        await api.post("/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        setShowProfile(false);
      }
    } catch (error) {
      console.error("Logout failed", error);
      // Force logout on error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  // ... (rest of logic)

  // Re-evaluating: easiest is to replace the whole file content or a large chunk including imports.
  // The file is small enough.
  return (
    <header className="h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {title || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden md:block w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-[var(--primary)] transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="fixed top-16 left-4 right-4 w-auto sm:absolute sm:right-0 sm:top-full sm:left-auto sm:w-80 max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <Link
                  href="/notifications"
                  className="text-xs text-[var(--primary)] hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {/* Mock notifications used directly here for now or re-inserted if we removed them from logic above, but better to keep them in state or var */}
                {[
                  {
                    id: 1,
                    title: "Flashcard due",
                    message: "ML review needed",
                    type: "urgent",
                    time: "10m",
                  },
                  {
                    id: 2,
                    title: "New Material",
                    message: "Calculus notes added",
                    type: "info",
                    time: "2h",
                  },
                ].map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none"
                    onClick={() => router.push("/notifications")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {notification.type === "urgent" ? (
                          <AlertCircle size={16} className="text-red-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {notification.time} ago
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100 text-center">
                <button
                  onClick={() => router.push("/notifications")}
                  className="text-sm text-gray-600 hover:text-[var(--primary)]"
                >
                  See previous notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          className="relative pl-6 border-l border-gray-200"
          ref={profileRef}
        >
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "Student"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.username || "StudyMate User"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-bold border border-[var(--primary)] hover:ring-2 ring-[var(--primary)]/20 transition-all uppercase">
              {user?.name ? user.name.charAt(0) : "S"}
            </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Student"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.username || "StudyMate User"}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowProfile(false)}
                >
                  <Home size={16} />
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowProfile(false)}
                >
                  <div className="w-4 h-4 rounded-[4px] border border-current" />
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowProfile(false)}
                >
                  <Settings size={16} />
                  Account Settings
                </Link>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
