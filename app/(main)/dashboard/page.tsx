"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  FileText,
  Brain,
  BookOpen,
  Clock,
  ChevronRight,
  Play,
  Upload,
  Zap,
} from "lucide-react";
import { CardSkeleton, ListSkeleton } from "@/components/Skeleton";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    {
      title: "Generated Summaries",
      value: "0",
      change: "Total",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Flashcards Created",
      value: "0",
      change: "Total",
      icon: Brain,
      color: "green",
    },
    {
      title: "Quizzes Taken",
      value: "0",
      change: "Total",
      icon: BookOpen,
      color: "orange", // Changed to orange/yellow to differ from others
    },
    {
      title: "Study Session",
      value: "0m",
      change: "Today",
      icon: Clock,
      color: "red",
    },
  ]);

  const [recentSummaries, setRecentSummaries] = useState<any[]>([]);
  const [suggestedStudySets, setSuggestedStudySets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionMinutes, setSessionMinutes] = useState(0);

  useEffect(() => {
    // Session Timer Heartbeat
    const timer = setInterval(async () => {
      setSessionMinutes((prev) => prev + 1);

      try {
        await api.post("/study-sessions", {
          duration_minutes: 1,
          date: new Date().toISOString().split("T")[0], // today YYYY-MM-DD
        });
      } catch (e) {
        console.error("Failed to track session heartbeat", e);
      }
    }, 60000); // 1 minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update stats text for Session Card
    setStats((currentStats) =>
      currentStats.map((s) => {
        if (s.title === "Study Session") {
          const hours = Math.floor(sessionMinutes / 60);
          const mins = sessionMinutes % 60;
          return { ...s, value: hours > 0 ? `${hours}h ${mins}m` : `${mins}m` };
        }
        return s;
      }),
    );
  }, [sessionMinutes]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStatsRes, recsRes] = await Promise.all([
          api.get("/user/stats"),
          api.get("/user/recommendations").catch((e) => ({ data: [] })),
        ]);

        const { stats: userStats, recent_summaries } = userStatsRes.data;
        const recommendations = recsRes.data || [];

        // Stats Calculation
        setSessionMinutes(userStats.today_study_minutes || 0);

        setStats((prev) => [
          {
            ...prev[0],
            value: (
              userStats.summaries_count ??
              userStats.summaries ??
              0
            ).toString(),
          },
          {
            ...prev[1],
            value: (
              userStats.flashcards_count ??
              userStats.flashcards ??
              0
            ).toString(),
          },
          {
            ...prev[2],
            value: (
              userStats.quizzes_count ??
              userStats.quizzes ??
              0
            ).toString(),
          },
          { ...prev[3], value: "0m" },
        ]);

        // Recent Summaries
        setRecentSummaries(
          (recent_summaries || []).map((s: any) => ({
            id: s.id,
            title: s.material?.title || "Untitled Summary",
            subject: "General",
            date: new Date(s.created_at).toLocaleDateString(),
            progress: 100,
          })),
        );

        // Recommendations from API
        setSuggestedStudySets(
          recommendations.map((rec: any) => ({
            id: rec.id,
            title: rec.title,
            cards: rec.topics ? `${rec.topics.length} topics` : "Recommended",
            difficulty: "Based on History",
            estimatedTime: "15 min",
          })),
        );
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleGetRecommendation = () => {
    // Mock functionality -> maybe scroll to suggested sets or toast
    const setsSection = document.getElementById("suggested-sets");
    if (setsSection) {
      setsSection.scrollIntoView({ behavior: "smooth" });
    } else if (suggestedStudySets.length === 0) {
      // If no recommendations, prompt user
      alert(
        "View a material first to generate study recommendations based on your activity!",
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="h-6 w-48 bg-gray-100 rounded mb-6 animate-pulse" />
            <ListSkeleton count={3} />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="h-6 w-48 bg-gray-100 rounded mb-6 animate-pulse" />
            <ListSkeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : stat.color === "green"
                        ? "bg-green-100 text-green-600"
                        : stat.color === "orange"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600"
                  }`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Summaries */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Summaries
            </h2>
            <button
              onClick={() => navigateTo("/materials")}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
            >
              View all
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {recentSummaries.length === 0 ? (
              <p className="text-gray-500 text-sm">No summaries yet.</p>
            ) : (
              recentSummaries.map((summary, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigateTo(`/materials/${summary.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {summary.title}
                    </h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">
                      {summary.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {summary.subject}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${summary.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {summary.progress}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suggested Study Sets (Dynamic from Local Storage) */}
        <div
          className="bg-white rounded-2xl border border-gray-200 p-6"
          id="suggested-sets"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Suggested Study Sets
            </h2>
            {/* Removed View All as this is dynamic history */}
          </div>

          <div className="space-y-4">
            {suggestedStudySets.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm mb-2">
                  No recommendations yet.
                </p>
                <p className="text-xs text-gray-400">
                  View a material to get study suggestions!
                </p>
              </div>
            ) : (
              suggestedStudySets.map((set, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigateTo(`/materials/${set.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {set.title}
                    </h3>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Play size={16} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{set.cards} flashcards</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {set.difficulty}
                    </span>
                    <span>{set.estimatedTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigateTo("/flashcards")}
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
          >
            <Brain size={32} className="mx-auto text-gray-400 mb-2" />
            <span className="block text-sm font-medium text-gray-700">
              Study Flashcards
            </span>
          </button>

          <button
            onClick={() => navigateTo("/quiz")}
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors text-center"
          >
            <BookOpen size={32} className="mx-auto text-gray-400 mb-2" />
            <span className="block text-sm font-medium text-gray-700">
              Take Quiz
            </span>
          </button>

          <button
            onClick={() => navigateTo("/materials")}
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
          >
            <FileText size={32} className="mx-auto text-gray-400 mb-2" />
            <span className="block text-sm font-medium text-gray-700">
              View Materials
            </span>
          </button>

          <button
            onClick={handleGetRecommendation}
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-colors text-center"
          >
            <Zap size={32} className="mx-auto text-gray-400 mb-2" />
            <span className="block text-sm font-medium text-gray-700">
              Get Recommendation
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
