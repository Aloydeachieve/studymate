"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { FileText, Upload, Clock, ChevronRight } from "lucide-react";

export default function LecturerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    {
      title: "Uploaded Materials",
      value: "0",
      change: "Total",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Recent Uploads",
      value: "0",
      change: "This Week",
      icon: Clock,
      color: "green",
    },
  ]);

  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/materials");
        const materials = response.data || [];

        const totalMaterials = materials.length;
        // Simple mock for "this week" logic or just show total for now

        setStats([
          {
            title: "Uploaded Materials",
            value: totalMaterials.toString(),
            change: "Total",
            icon: FileText,
            color: "blue",
          },
          {
            title: "Recent Uploads",
            value: materials.slice(0, 5).length.toString(), // Just showing count of recent fetched
            change: "Latest",
            icon: Clock,
            color: "green",
          },
        ]);

        const sorted = [...materials].sort(
          (a: any, b: any) =>
            new Date(b.created_at || b.date).getTime() -
            new Date(a.created_at || a.date).getTime(),
        );

        setRecentUploads(sorted.slice(0, 5));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lecturer Dashboard</h1>
        <button
          onClick={() => navigateTo("/upload")}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={20} />
          Upload New Material
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === "blue" ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      stat.color === "blue" ? "text-blue-600" : "text-green-600"
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Uploads</h2>
          <button
            onClick={() => navigateTo("/materials")}
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
          >
            View all
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="space-y-4">
          {recentUploads.length === 0 ? (
            <p className="text-gray-500 text-sm">No uploads yet.</p>
          ) : (
            recentUploads.map((material, index) => (
              <div
                key={index}
                className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer"
                onClick={() => navigateTo(`/materials/${material.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {material.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(
                      material.created_at || material.date,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {material.subject || "General"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
