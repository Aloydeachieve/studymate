"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Menu,
  Settings,
  LogOut,
  Home,
  AlertCircle,
  LayoutDashboard,
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<{
    name: string;
    username?: string;
    role?: number;
  } | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        const data = res.data.notifications || res.data || [];
        setNotifications(data);
        const unread = data.filter((n: any) => !n.read_at).length;
        setUnreadCount(unread);
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      }
    };

    if (user) {
      fetchNotifications();
      // Optional: Polling every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  // Determine which dashboard to go to based on role
  const dashboardPath = user?.role === 2 ? "/lecturer-dashboard" : "/dashboard";

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
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
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
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none ${
                        !notification.read_at ? "bg-red-50/30" : ""
                      }`}
                      onClick={() => {
                        setShowNotifications(false);
                        router.push("/notifications");
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {notification.type === "urgent" ? (
                            <AlertCircle size={16} className="text-red-500" />
                          ) : (
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${
                                !notification.read_at ? "bg-red-500" : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm ${!notification.read_at ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>
                            {notification.title || notification.data?.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {notification.message || notification.data?.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {notification.created_at_human || "Just now"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                {/* Role-based dashboard link */}
                <Link
                  href={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowProfile(false)}
                >
                  <LayoutDashboard size={16} />
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
