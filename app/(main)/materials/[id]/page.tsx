"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "@/lib/api";
import {
  FileText,
  Brain,
  BookOpen,
  ChevronLeft,
  Share2,
  Clock,
  Calendar,
  Download,
  MessageSquare,
  RefreshCw,
  Zap,
  AlignLeft,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary"); // 'summary' | 'content'
  const [role, setRole] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // AI Chat State
  const [aiQuery, setAiQuery] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', message: string}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Regenerate State
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setRole(u.role || 0);
        if (u.role === 2) {
            setActiveTab("content");
        }
      } catch (e) {
        console.error("Parse user error", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      try {
        // 1. Fetch Material Details
        const response = await api.get(`/materials/${id}`);
        setMaterial(response.data);

        // 2. Fetch Recommendations (Using Dedicated Endpoint)
        try {
            const recRes = await api.get(`/study-materials/${id}/recommendations`);
            setRecommendations(recRes.data || []);
            
            // Update Local Storage History
            if (recRes.data && recRes.data.length > 0) {
                 localStorage.setItem("lastRecommendations", JSON.stringify(recRes.data.slice(0,5)));
            }
        } catch (recError) {
             console.warn("Failed to load recommendations", recError);
        }

      } catch (error: any) {
        console.error("Error fetching material", error);
        toast.error("Failed to load material details");
         if (error.response && error.response.status === 404) {
            router.push("/materials");
          }
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id, router]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleDownload = () => {
    if (material?.file_path) {
        // Construct standard storage URL. Adjust if your environment differs.
        const url = material.file_path.startsWith('http') 
            ? material.file_path 
            : `http://localhost:8000/storage/${material.file_path}`;
        window.open(url, "_blank");
    } else {
        toast.error("File path not available");
    }
  };

  const handleAiChat = async () => {
    if (!aiQuery.trim()) return;
    
    const userMsg = aiQuery;
    setAiQuery("");
    setChatHistory(prev => [...prev, { role: 'user', message: userMsg }]);
    setIsChatting(true);

    try {
        // POST /study-materials/{id}/chat
        // Based on user provided controller: AIChatController::sendMessage
        // Route assumed: /study-materials/{id}/chat
        const res = await api.post(`/study-materials/${id}/chat`, {
            message: userMsg
        });

        if (res.data && res.data.data && res.data.data.ai_message) {
             setChatHistory(prev => [...prev, { role: 'ai', message: res.data.data.ai_message.message }]);
        } else {
             // Fallback if structure differs
             setChatHistory(prev => [...prev, { role: 'ai', message: "I'm sorry, I couldn't process that response." }]);
        }

    } catch (e) {
        console.error("Chat error", e);
        toast.error("Failed to send message");
        setChatHistory(prev => [...prev, { role: 'ai', message: "Error: Could not reach AI service." }]);
    } finally {
        setIsChatting(false);
    }
  };

  const handleRegenerateSummary = async () => {
    if (regenerating) return;
    if(!confirm("Are you sure? This will overwrite the existing summary.")) return;

    setRegenerating(true);
    toast.loading("Regenerating summary...", { id: "regen" });
    
    try {
        // Use endpoint: POST /study-materials/{id}/generate-summary?force=true
        await api.post(`/study-materials/${id}/generate-summary?force=true`);
        
        toast.success("Summary Regenerated!", { id: "regen" });
        // Reload page to see new summary
        window.location.reload();
    } catch (e) {
        console.error("Regeneration failed", e);
        toast.error("Failed to regenerate summary", { id: "regen" });
    } finally {
        setRegenerating(false);
    }
  };

  // --- Parser Logic (Robust User Choice) ---
  let analysisResult = {
    summary: material?.summary || "", 
    topics: material?.summary_topics || [],
    keyTerms: material?.summary_key_terms || [],
    difficulty: "Medium",
    estimatedStudyTime: "5 min",
  };

  // Parsing recovery
  if (
    typeof analysisResult.summary === "string" &&
    (analysisResult.summary.trim().startsWith("{") ||
      analysisResult.summary.includes("```json"))
  ) {
    try {
      const cleanJson = analysisResult.summary
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanJson);
      if (parsed.summary || parsed.topics) {
        analysisResult = {
          ...analysisResult,
          summary: parsed.summary || analysisResult.summary,
          topics: parsed.topics || parsed.summary_topics || analysisResult.topics,
          keyTerms: parsed.key_terms || parsed.keyTerms || analysisResult.keyTerms,
        };
      }
    } catch (e) {
      console.warn("Frontend failed to rescue raw JSON summary:", e);
    }
  }

  const isLecturer = role === 2;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!material) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/materials")}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Back to Materials"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 truncate max-w-md">
                  {material.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    {new Date(material.created_at || material.date).toLocaleDateString()}
                  </span>
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-1" />
                  <span>5 mins read</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Download Original File"
              >
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs (For Everyone) 
              User requested: use tabs to differentiate AI Analysis vs Normal Document Text 
          */}
          <div className="flex space-x-8 mt-4 overflow-x-auto">
            {/* AI Summary Tab */}
            <button
              onClick={() => setActiveTab("summary")}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "summary"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <Brain size={18} className="mr-2" />
                AI Analysis
              </div>
            </button>

            {/* Original Content Tab */}
            <button
              onClick={() => setActiveTab("content")}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "content"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <FileText size={18} className="mr-2" />
                Read Material
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* CONTENT TAB: Extracted Text logic */}
            {activeTab === "content" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Extracted Content
                            </span>
                        </h2>
                        <button 
                            onClick={handleDownload}
                            className="text-sm text-red-600 hover:underline flex items-center"
                        >
                            <Download size={16} className="mr-1"/> Download File
                        </button>
                    </div>

                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100 overflow-x-auto">
                        {material.content || material.extracted_text ||  (
                            <div className="text-center py-8 text-gray-500 italic">
                                {/* If logic implies we only have 'has_extracted_text' boolean but not text, we verify:
                                    If has_extracted_text is true but we don't have text here, backend didn't send it.
                                 */}
                                {material.has_extracted_text ? (
                                    <span>
                                        This document has been processed, but the text preview is not available in this view.
                                        <br/>
                                        Please download the full file to read it.
                                    </span>
                                ) : (
                                    <span>
                                        No text content extracted for this file.
                                        <br/>
                                        Please download to view.
                                    </span>
                                )}
                                <br/>
                                <button onClick={handleDownload} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 text-sm font-medium transition-colors">
                                    Download File
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SUMMARY TAB: AI Analysis logic */}
            {activeTab === "summary" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                                AI Summary
                            </span>
                        </h2>
                        <div className="flex space-x-2">
                             <button 
                                onClick={handleRegenerateSummary}
                                disabled={regenerating}
                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Regenerate Summary"
                            >
                                <RefreshCw size={18} className={regenerating ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    {analysisResult.summary ? (
                        <div className="prose prose-red max-w-none">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                }}
                            >
                                {analysisResult.summary}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                                <Clock size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                Summary Generating...
                            </h3>
                            <p className="text-gray-500 text-sm">
                                This document is being processed by our AI. Check back soon.
                            </p>
                            <button 
                                onClick={handleRegenerateSummary}
                                className="mt-4 text-xs text-red-600 hover:underline"
                            >
                                Force Regenerate
                            </button>
                        </div>
                    )}
                </div>
            )}
            
          </div>

          {/* Sidebar - Tools & Info */}
          <div className="space-y-6">
            
            {/* AI Chat */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 p-6 flex flex-col h-[400px]">
                <div className="flex items-center mb-4 flex-shrink-0">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600 mr-3">
                        <MessageSquare size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900">Ask AI</h3>
                </div>
                
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                     {chatHistory.length === 0 && (
                        <div className="text-center text-sm text-gray-500 py-8 italic opacity-70">
                            Ask a question about this material...
                        </div>
                     )}
                     {chatHistory.map((chat, i) => (
                        <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
                                chat.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white border border-blue-100 text-gray-800'
                            }`}>
                                {chat.message}
                            </div>
                        </div>
                     ))}
                     <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2 flex-shrink-0">
                    <input 
                        type="text" 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                        placeholder="Type query..." 
                        disabled={isChatting}
                        className="flex-1 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent p-2 disabled:opacity-50" 
                    />
                    <button 
                        onClick={handleAiChat}
                        disabled={isChatting}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isChatting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
            </div>

            {/* Quick Actions - Study Tools */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Study Tools</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/flashcards?material=${id}`)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-all group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-600 group-hover:text-red-600 mr-3">
                      <Brain size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 group-hover:text-red-700">
                        Generate Flashcards
                      </p>
                      <p className="text-xs text-gray-500">
                        Create cards from this text
                      </p>
                    </div>
                  </div>
                  <ChevronLeft
                    size={16}
                    className="text-gray-400 rotate-180 group-hover:text-red-600"
                  />
                </button>

                <button
                  onClick={() => router.push(`/quiz?material=${id}`)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-xl transition-all group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-600 group-hover:text-orange-600 mr-3">
                      <BookOpen size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 group-hover:text-orange-700">
                        Generate Quiz
                      </p>
                      <p className="text-xs text-gray-500">
                        Test your knowledge
                      </p>
                    </div>
                  </div>
                  <ChevronLeft
                    size={16}
                    className="text-gray-400 rotate-180 group-hover:text-orange-600"
                  />
                </button>
              </div>
            </div>

            {/* Analysis Data (Topics/Keys) - Linked to Summary usually */}
            {activeTab === "summary" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">
                    Topics Covered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                    {analysisResult.topics && analysisResult.topics.length > 0 ? (
                        analysisResult.topics.map((topic: any, i: number) => {
                             const topicName = typeof topic === "string" ? topic : topic.name;
                             return (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                >
                                    {topicName}
                                </span>
                             );
                        })
                    ) : (
                        <span className="text-sm text-gray-500">
                        No topics detected
                        </span>
                    )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        Key Terms
                    </h3>
                    <div className="space-y-2">
                        {analysisResult.keyTerms && analysisResult.keyTerms.length > 0 ? (
                        analysisResult.keyTerms.map(
                            (term: string, i: number) => (
                            <div
                                key={i}
                                className="flex items-start text-sm text-gray-600"
                            >
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0" />
                                {term}
                            </div>
                            ),
                        )
                        ) : (
                        <span className="text-sm text-gray-500">
                            No specific terms extracted
                        </span>
                        )}
                    </div>
                    </div>
                </div>
            )}
            
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recommended Next Reads
                </h2>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/materials/${rec.id}`)}
                    >
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {rec.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                          {rec.subject || "General"}
                        </span>
                        <span>
                          •{" "}
                          {new Date(
                            rec.created_at || rec.date,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}