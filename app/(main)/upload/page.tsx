"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  FileText,
  Image,
  File as FileIcon,
  Type,
  Check,
  Brain,
  BookOpen,
  Zap,
  Clock,
  X,
  Download,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import RoleGuard from "@/components/RoleGuard";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<
    File | { name: string; type: string } | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFiles = [
    {
      icon: FileText,
      label: "PDF",
      description: "Documents, textbooks, papers",
    },
    {
      icon: Image,
      label: "Images",
      description: "Screenshots, diagrams, notes",
    },
    {
      icon: FileIcon,
      label: "Docs",
      description: "Word, PowerPoint, text files",
    },
    { icon: Type, label: "Text", description: "Paste text directly" },
  ];

  /* 
  // REMOVED MOCK ANALYSIS
  const mockAnalysis = { ... } 
  */

  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  // ... inside UploadPage component
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(10); // Start progress

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Validations might require these fields
      formData.append("title", file.name);
      formData.append("original_filename", file.name);

      // Simulate progress for UX (since fetch doesn't give upload progress easily without axios config,
      // but we are using axios wrapped in api which supports it but tricky to bubble up through our simple wrapper if not configured)
      // We will just show generic loading or use an interval for visual feedback until request finishes.
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);

      // Trigger upload
      const response = await api.post("/materials/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Assume response contains the new material/analysis result
      // The prompt says "Show loading state during upload + AI processing".
      // This implies we might want to wait or move to "Processing" state.

      // Auto-trigger analysis
      const materialId =
        response.data?.id ||
        response.data?.data?.id ||
        response.data?.material?.id;

      console.log("Upload response:", response.data); // Debug log to verify structure

      if (materialId) {
        setIsUploading(false); // Stop upload spinner
        setIsGeneratingSummary(true); // Start summary spinner

        try {
          // We await this, which takes 20-30s
          await api.post(`/materials/${materialId}/generate-summary`);
          toast.success("Summary generated successfully!");
        } catch (e) {
          console.error("Auto-generation failed", e);
          toast.error("Summary generation failed, but file uploaded.");
        } finally {
          setIsGeneratingSummary(false);
          router.push(`/materials/${materialId}`);
        }
      } else {
        console.error("Missing ID in response:", response.data);
        toast.error("Upload successful but ID missing");
        setIsUploading(false);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload file");
      setIsUploading(false);
      setUploadedFile(null); // Reset
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      // Extract first line or reasonable length substring for title
      const firstLine = textInput.trim().split("\n")[0];
      const safeTitle =
        firstLine
          .substring(0, 50)
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .trim() || "Untitled Note";
      const fileName = `${safeTitle}.txt`;

      // Create a file from text
      const blob = new Blob([textInput], { type: "text/plain" });
      const file = new File([blob], fileName, { type: "text/plain" }); // Uses native File
      handleFileUpload(file);
    }
  };

  return (
    <RoleGuard allowedRoles={[2]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigateTo("/dashboard")}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Upload Study Material
              </h1>
              <p className="text-gray-600 mt-1">
                Upload your files or paste text to get started
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-8 mb-8">
            {!uploadedFile ? (
              <>
                {/* File Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 md:p-12 text-center transition-colors ${
                    dragActive
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload
                    size={48}
                    className={`mx-auto mb-4 ${
                      dragActive ? "text-red-600" : "text-gray-400"
                    }`}
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {dragActive
                      ? "Drop files here"
                      : "Upload your study materials"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Drag and drop files here, or click to browse
                  </p>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <Upload size={20} className="mr-2" />
                    Choose Files
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      e.target.files && handleFileUpload(e.target.files[0])
                    }
                  />

                  <p className="text-sm text-gray-500 mt-4">
                    Maximum file size: 50MB
                  </p>
                </div>

                {/* Supported File Types */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Supported File Types
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {supportedFiles.map((file, index) => {
                      const Icon = file.icon;
                      return (
                        <div
                          key={index}
                          className="text-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                          <Icon
                            size={32}
                            className="mx-auto text-gray-400 mb-2"
                          />
                          <p className="font-medium text-gray-900">
                            {file.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {file.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Upload Progress */
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {uploadedFile.name}
                </h3>
                <p className="text-gray-600 mb-4">File uploaded successfully</p>

                {isUploading && (
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Uploading</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {isGeneratingSummary && (
                  <div className="max-w-md mx-auto mt-4">
                    <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                      <Brain className="animate-pulse" size={20} />
                      <span className="font-medium">
                        Generating AI Summary...
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      This may take a few moments
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full animate-pulse w-full"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Text Input Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Or Paste Text Directly
            </h2>
            <textarea
              value={textInput}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setTextInput(e.target.value)
              }
              placeholder="Paste your study material here..."
              className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                {textInput.length} characters
              </p>
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Process Text
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
