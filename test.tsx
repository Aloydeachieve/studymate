"use client";
import Link from "next/link";
import {
  ArrowRight, // Corrected: Removed extra comma
  BookOpen, // Corrected: Removed extra comma
  Brain, // Corrected: Removed extra comma
  FileText,
  Layers,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-3xl">📚</span>
          <span className="text-2xl font-bold text-[var(--primary)]">
            StudyMate
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="btn-outline">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary">
            Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-[var(--secondary)]">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-[var(--primary)] text-[var(--primary)] text-sm font-semibold mb-4">
            🚀 AI-Powered Study Assistant
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Organize. Summarize. <br />
            <span className="text-[var(--primary)]">Study Smarter.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your study materials and let our AI generate summaries,
            flashcards, and quizzes instantly. Ace your exams with less stress.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="btn-primary text-lg px-8 py-3 flex items-center gap-2"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-md text-gray-600 hover:bg-gray-100 font-medium transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Illustration Placeholder */}
        <div className="mt-16 w-full max-w-4xl h-64 md:h-96 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50"></div>
          <div className="text-gray-300 flex flex-col items-center gap-4">
            <div className="flex gap-8 opacity-50">
              <BookOpen size={64} />
              <Brain size={64} />
              <FileText size={64} />
            </div>
            <p className="font-medium">App Dashboard Preview</p>
          </div>
        </div>
      </header>

      {/* How it Works */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600">
            From messy notes to structured study sets in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: FileText,
              title: "1. Upload",
              desc: "Upload PDFs, docs, or images of your notes.",
            },
            {
              icon: Brain,
              title: "2. AI Analysis",
              desc: "Our AI analyzes and extracts key concepts.",
            },
            {
              icon: Layers,
              title: "3. Organize",
              desc: "Get auto-generated summaries and topics.",
            },
            {
              icon: BookOpen,
              title: "4. Study",
              desc: "Practice with flashcards and quizzes.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center text-[var(--primary)] mb-6">
                <step.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Everything you need to excel
              </h2>
              <div className="space-y-6">
                {[
                  "Auto-Summary: Turn long papers into concise notes.",
                  "Smart Flashcards: Generated instantly from your content.",
                  "Topic Grouping: Keep related materials together.",
                  "Quiz Generator: Test your knowledge before the exam.",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle
                      className="text-[var(--primary)] shrink-0 mt-1"
                      size={20}
                    />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-80 flex items-center justify-center">
              <p className="text-gray-400">Feature Showcase UI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">
          Loved by Students
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah J.",
              school: "Stanford University",
              quote:
                "StudyMate saved my finals. The auto-summaries are a game changer!",
            },
            {
              name: "Mike T.",
              school: "High School Senior",
              quote:
                "I use the flashcards every day on the bus. So easy to use.",
            },
            {
              name: "Emily R.",
              school: "Medical Student",
              quote:
                "The quiz generator helps me identify weak spots immediately.",
            },
          ].map((t, i) => (
            <div key={i} className="card">
              <p className="text-gray-600 italic mb-4">"{t.quote}"</p>
              <div>
                <p className="font-bold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.school}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-white">StudyMate</span>
            </div>
            <p className="text-sm">
              Making studying efficient and effective for everyone.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  For Schools
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}



































"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  ArrowLeft,
  Check,
  Brain,
  BookOpen,
  Zap,
  Download,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [material, setMaterial] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (recommendations.length > 0) {
      localStorage.setItem(
        "lastRecommendations",
        JSON.stringify(recommendations),
      );
    }
  }, [recommendations]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMaterialDetails();
    }
  }, [id]);

  const fetchMaterialDetails = async () => {
    try {
      const response = await api.get(`materials/${id}`);
      setMaterial(response.data);

      // Fetch potential recommendations
      try {
        const allMaterialsRes = await api.get("/materials");
        const allMaterials = allMaterialsRes.data || [];

        // Simple recommendation logic: same subject or shared topics, excluding current
        const currentMat = response.data;
        const currentTopics = new Set(
          (currentMat.summary_topics || []).map((t: any) =>
            typeof t === "string" ? t.toLowerCase() : t.name.toLowerCase(),
          ),
        );

        const recs = allMaterials
          .filter((m: any) => m.id !== currentMat.id)
          .map((m: any) => {
            let score = 0;
            if (m.subject === currentMat.subject) score += 2;

            const mTopics = (m.summary_topics || []).map((t: any) =>
              typeof t === "string" ? t.toLowerCase() : t.name.toLowerCase(),
            );

            // Check topic overlaps
            mTopics.forEach((t: string) => {
              if (currentTopics.has(t)) score += 1;
            });

            return { ...m, score };
          })
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 3); // Take top 3

        setRecommendations(recs);
      } catch (recError) {
        console.warn("Failed to load recommendations", recError);
      }
    } catch (error: any) {
      console.error("Error fetching material details", error);
      toast.error("Failed to load material details");
      if (error.response && error.response.status === 404) {
        router.push("/materials");
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const generateFlashcards = () => {
    navigateTo(`/flashcards?material=${id}`);
  };

  const generateQuiz = () => {
    navigateTo(`/quiz?material=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <p className="text-gray-500">Loading material details...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">
            Material not found
          </h3>
          <button
            onClick={() => navigateTo("/materials")}
            className="mt-4 text-red-600 hover:underline"
          >
            Back to materials
          </button>
        </div>
      </div>
    );
  }

  // Normalize the data based on the flat structure returned by StudyMaterialController::show
  let analysisResult = {
    summary: material.summary || "", // The controller maps summary_text to 'summary'
    topics: material.summary_topics || [],
    keyTerms: material.summary_key_terms || [],
    difficulty: "Medium",
    estimatedStudyTime: "5 min",
  };

  // RECOVERY MECHANISM:
  // Sometimes the backend fails to parse the AI JSON and saves the raw JSON string as 'summary'.
  // We attempt to detect and parse this here to "rescue" the UI.
  if (
    typeof analysisResult.summary === "string" &&
    (analysisResult.summary.trim().startsWith("{") ||
      analysisResult.summary.includes("```json"))
  ) {
    try {
      // Clean up markdown code blocks if present
      const cleanJson = analysisResult.summary
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanJson);

      // If we successfully parsed it and it has the expected structure, update analysisResult
      if (parsed.summary || parsed.topics) {
        analysisResult = {
          ...analysisResult,
          summary: parsed.summary || analysisResult.summary,
          topics:
            parsed.topics || parsed.summary_topics || analysisResult.topics,
          keyTerms:
            parsed.key_terms || parsed.keyTerms || analysisResult.keyTerms,
          // We can also extract title if we wanted, but material.title is usually fine
        };
      }
    } catch (e) {
      // JSON parsing failed, just show the raw text as before (safe fallback)
      console.warn("Frontend failed to rescue raw JSON summary:", e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigateTo("/materials")}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 break-words">
              {material.title}
            </h1>
            <p className="text-gray-600 mt-1">
              Uploaded on{" "}
              {new Date(
                material.created_at || material.date || Date.now(),
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Analysis */}
          <div className="space-y-6">
            {/* File Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                File Details
              </h2>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <FileText size={24} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 break-all">
                    {material.original_filename || material.filename || "File"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {material.size || "Unknown size"} •{" "}
                    {material.type || "Document"}
                  </p>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Auto-Detected Topics
              </h2>
              <div className="space-y-3">
                {analysisResult.topics.map((topic: any, index: number) => {
                  // Handle if topic is object or string (backend sends strings usually)
                  const topicName =
                    typeof topic === "string" ? topic : topic.name;
                  const confidence =
                    typeof topic === "string" ? 85 : topic.confidence || 85;

                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0"
                    >
                      <span className="text-gray-700">{topicName}</span>
                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <div className="flex-1 sm:w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8 text-right">
                          {confidence}%
                        </span>
                      </div>
                    </div>
                  );
                })}
                {analysisResult.topics.length === 0 && (
                  <p className="text-gray-500">No topics detected.</p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                AI Summary
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-semibold text-gray-900 mb-3 mt-6"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-medium text-gray-900 mb-2 mt-4"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-5 space-y-2 mb-4 text-gray-700"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-5 space-y-2 mb-4 text-gray-700"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="pl-1" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-4 text-gray-700 leading-relaxed"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-semibold text-gray-900"
                        {...props}
                      />
                    ),
                  }}
                >
                  {analysisResult.summary || "No summary available."}
                </ReactMarkdown>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {analysisResult.estimatedStudyTime}
                    </p>
                    <p className="text-sm text-gray-500">Study Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {analysisResult.difficulty}
                    </p>
                    <p className="text-sm text-gray-500">Difficulty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Key Terms */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Key Terms
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysisResult.keyTerms.map((term: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {term}
                  </span>
                ))}
                {analysisResult.keyTerms.length === 0 && (
                  <span className="text-gray-500 text-sm">
                    No key terms found.
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Next Steps
              </h2>
              <div className="space-y-4">
                <button
                  onClick={generateFlashcards}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <Brain size={20} className="text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 break-words">
                        Generate Flashcards
                      </p>
                      <p className="text-sm text-gray-500">
                        Create interactive study cards
                      </p>
                    </div>
                  </div>
                  <Zap size={20} className="text-gray-400 shrink-0" />
                </button>

                <button
                  onClick={generateQuiz}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BookOpen size={20} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 break-words">
                        Generate Quiz Questions
                      </p>
                      <p className="text-sm text-gray-500">
                        Test your understanding
                      </p>
                    </div>
                  </div>
                  <Zap size={20} className="text-gray-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* Recommended Next Reads */}
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
                      onClick={() => navigateTo(`/materials/${rec.id}`)}
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
