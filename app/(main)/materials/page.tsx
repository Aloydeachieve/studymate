"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  FileText,
  Image,
  File,
  Eye,
  Brain,
  BookOpen,
  MoreHorizontal,
  Download,
  Trash2,
  Star,
  Calendar,
  Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function MyMaterialsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [role, setRole] = useState<number>(0);

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setRole(parsed.role || 0);
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await api.get("/materials");
      const data = response.data || [];
      // Transform if necessary to match UI expected shape
      // Assuming API returns object with id, title, subject, etc.
      setMaterials(
        data.map((m: any) => ({
          ...m,
          // Ensure defaults for missing fields
          type: m.type || "text",
          subject: m.subject || "General",
          uploadDate: m.created_at || m.date || new Date().toISOString(),
          size: m.size || "Unknown",
          summary: m.summary || "",
          flashcards: m.flashcards_count || 0,
          quizzes: m.quizzes_count || 0,
          isFavorite: m.is_favorite || false,
          thumbnail: m.thumbnail || null,
          readingTime: m.reading_time || "5 min",
        })),
      );
    } catch (error) {
      console.error("Error fetching materials", error);
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic categories based on fetched materials
  const categories = [
    "all",
    ...new Set(materials.map((m) => m.subject).filter(Boolean)),
  ];
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
    { value: "name", label: "Name A-Z" },
    { value: "subject", label: "Subject" },
    { value: "size", label: "File Size" },
  ];

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText size={20} className="text-red-600" />;
      case "image":
        return <Image size={20} className="text-green-600" />;
      case "doc":
        return <File size={20} className="text-blue-600" />;
      case "text":
        return <FileText size={20} className="text-purple-600" />;
      default:
        return <File size={20} className="text-gray-600" />;
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      (material.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.subject || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || material.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        );
      case "name":
        return (a.title || "").localeCompare(b.title || "");
      case "subject":
        return (a.subject || "").localeCompare(b.subject || "");
      case "size":
        // simple parsing assuming format like "2 MB"
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0;
    }
  });

  const toggleFavorite = (materialId: number) => {
    // In a real app, this would update the backend
    console.log("Toggle favorite for material:", materialId);
    // Optimistic update
    setMaterials(
      materials.map((m) =>
        m.id === materialId ? { ...m, isFavorite: !m.isFavorite } : m,
      ),
    );
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
      await api.delete(`/materials/${id}`);
      setMaterials(materials.filter((m) => m.id !== id));
      toast.success("Material deleted");
    } catch (e) {
      toast.error("Failed to delete material");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading materials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <button
              onClick={() => navigateTo("/dashboard")}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {role === 2 ? "My Materials" : "Study Materials"}
              </h1>
              <p className="text-gray-600 mt-1">
                {materials.length} study materials
              </p>
            </div>
          </div>

          {role === 2 && (
            <button
              onClick={() => navigateTo("/upload")}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
            >
              Upload New Material
            </button>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Subjects" : category}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden self-start sm:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 sm:p-3 ${
                    viewMode === "grid"
                      ? "bg-red-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 sm:p-3 ${
                    viewMode === "list"
                      ? "bg-red-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Materials Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMaterials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div
                  className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative cursor-pointer"
                  onClick={() => navigateTo(`/materials/${material.id}`)}
                >
                  {material.thumbnail ? (
                    <img
                      src={material.thumbnail}
                      alt={material.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(material.type)}
                    </div>
                  )}

                  <div
                    className="absolute top-3 right-3 flex space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => toggleFavorite(material.id)}
                      className={`p-2 rounded-lg backdrop-blur-sm ${
                        material.isFavorite
                          ? "bg-yellow-500/20 text-yellow-600"
                          : "bg-white/20 text-gray-600 hover:bg-white/30"
                      }`}
                    >
                      <Star
                        size={16}
                        fill={material.isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                    {/* <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-gray-600 hover:bg-white/30">
                      <MoreHorizontal size={16} />
                    </button> */}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                      {material.readingTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-red-600"
                      onClick={() => navigateTo(`/materials/${material.id}`)}
                    >
                      {material.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {material.subject}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {material.size}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {material.summary}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Brain size={16} className="mr-1" />
                        {material.flashcards}
                      </div>
                      <div className="flex items-center">
                        <BookOpen size={16} className="mr-1" />
                        {material.quizzes}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(material.uploadDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateTo(`/materials/${material.id}`)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <Eye size={16} className="mr-2" />
                      View
                    </button>
                    {role === 2 && (
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Subject
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Study Materials
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleFavorite(material.id)}
                            className={`${
                              material.isFavorite
                                ? "text-yellow-500"
                                : "text-gray-300 hover:text-gray-400"
                            }`}
                          >
                            <Star
                              size={16}
                              fill={
                                material.isFavorite ? "currentColor" : "none"
                              }
                            />
                          </button>
                          {getFileIcon(material.type)}
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              navigateTo(`/materials/${material.id}`)
                            }
                          >
                            <p className="font-medium text-gray-900 hover:text-red-600">
                              {material.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {material.size}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {material.subject}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600 text-sm capitalize">
                          {material.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Brain size={16} className="mr-1" />
                            {material.flashcards}
                          </div>
                          <div className="flex items-center">
                            <BookOpen size={16} className="mr-1" />
                            {material.quizzes}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(material.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              navigateTo(`/materials/${material.id}`)
                            }
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Download size={16} />
                          </button>
                          {role === 2 && (
                            <button
                              onClick={() => handleDelete(material.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedMaterials.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No materials found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : role === 2
                  ? "Upload your first study material to get started"
                  : "Materials uploaded by your lecturer will appear here."}
            </p>
            {role === 2 && (
              <button
                onClick={() => navigateTo("/upload")}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Upload Material
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
