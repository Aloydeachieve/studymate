"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Check, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { ListSkeleton } from "@/components/Skeleton";

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      // Backend might return { notifications: [] } or just []
      const data = res.data.notifications || res.data || [];
      setNotifications(data);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      await api.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      toast.success("All notifications marked as read");
    } catch (e) {
      console.error("Failed to mark all as read", e);
      toast.error("Action failed");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read_at;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="text-red-500" size={20} />;
      case "success":
        return <Check className="text-green-500" size={20} />;
      case "warning":
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <Bell className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with your study progress
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Unread
            </button>
          </div>
          {notifications.some((n) => !n.read_at) && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              {isMarkingAll ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <CheckCircle2 size={16} className="mr-1" />
              )}
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <ListSkeleton count={5} />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <Bell className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                className={`bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group ${
                  !notification.read_at ? "border-l-4 border-l-red-500 bg-red-50/10" : "opacity-80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${!notification.read_at ? "bg-red-50" : "bg-gray-50"}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-semibold ${
                          !notification.read_at ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {notification.title || notification.data?.title}
                      </h3>
                      <span className="text-xs text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {notification.created_at_human || notification.time}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {notification.message || notification.data?.message}
                    </p>
                  </div>
                </div>
                {!notification.read_at && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
