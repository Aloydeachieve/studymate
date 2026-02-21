"use client";

import { useState } from "react";
import { ArrowLeft, Bell, Check, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: 1,
      title: "Flashcard due for review",
      message: "Your 'Introduction to Machine Learning' deck needs review.",
      type: "urgent",
      time: "10 min ago",
      read: false,
    },
    {
      id: 2,
      title: "New study material available",
      message: "Dr. Smith uploaded 'Advanced Calculus Notes'.",
      type: "info",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Quiz completed",
      message: "You scored 85% on 'European History'. Great job!",
      type: "success",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      title: "System Maintenance",
      message: "Scheduled maintenance tonight at 2 AM EST.",
      type: "warning",
      time: "2 days ago",
      read: true,
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
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
        <div className="flex gap-4 mb-6">
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

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${
                !notification.read ? "border-l-4 border-l-red-500" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold ${
                        !notification.read ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
