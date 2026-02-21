"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Check,
  X,
  Brain,
  Clock,
  Target,
  FileText,
  Sparkles,
  Loader2,
  Settings2,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

// Local interfaces based on API expectation
interface Material {
  id: string | number;
  title: string;
  subject: string;
  type: string;
  pageCount?: number;
  [key: string]: any;
}

interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty?: "Easy" | "Medium" | "Hard"; // API might return generic difficulty
  category?: string;
  [key: string]: any;
}

export default function FlashcardsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedMaterialId = searchParams.get("material");

  const [step, setStep] = useState<
    "selection" | "config" | "generating" | "study" | "complete"
  >("selection");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );
  const [quantity, setQuantity] = useState<number>(5);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Flashcard State
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [difficulty, setDifficulty] = useState<Record<number, "easy" | "hard">>(
    {},
  );
  const [studyStartTime] = useState<number>(Date.now());

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await api.get("/materials");
      const mats = res.data || [];
      setMaterials(mats);

      // Handle pre-selection via URL param
      if (preSelectedMaterialId) {
        const found = mats.find(
          (m: any) => m.id.toString() === preSelectedMaterialId.toString(),
        );
        if (found) {
          setSelectedMaterial(found);
          setStep("config");
        }
      }
    } catch (e) {
      console.error("Failed to fetch materials", e);
      toast.error("Could not load materials");
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material);
    setStep("config");
  };

  const handleStartGeneration = async () => {
    if (!selectedMaterial) return;
    setStep("generating");

    try {
      // 1. Generate Flashcards
      // API: POST /api/study-materials/{id}/generate-flashcards
      const genResponse = await api.post(
        `/study-materials/${selectedMaterial.id}/generate-flashcards`,
        {
          amount: quantity,
        },
      );

      // Check for success message or direct data (just in case)
      if (genResponse.status === 200 || genResponse.status === 201) {
        // 2. Fetch the generated flashcards
        // API: GET /api/study-materials/{id}/flashcards
        console.log("Generation success, fetching cards...");
        const fetchResponse = await api.get(
          `/study-materials/${selectedMaterial.id}/flashcards`,
        );

        console.log("Fetch response:", fetchResponse.data);
        let allCards = fetchResponse.data;

        // Ensure it is an array
        if (!Array.isArray(allCards)) {
          // Handle if wrapped in data or something
          allCards = allCards.data || [];
        }

        if (!Array.isArray(allCards)) {
          console.error("Expected array from fetch but got:", allCards);
          allCards = [];
        }

        // FILTERING: User wants to see ONLY the newly generated cards.
        // Assuming the API returns all cards sorted by creation (oldest to newest),
        // we take the LAST 'quantity' cards.
        const latestCards = allCards.slice(-quantity);

        // Map to match frontend Flashcard interface
        const mappedCards = latestCards.map((c: any, index: number) => ({
          id: c.id || index,
          front: c.question || c.front || "Question",
          back: c.answer || c.back || "Answer",
          difficulty: "Medium",
          category: "General",
        }));

        if (mappedCards.length === 0) {
          toast.error("No flashcards found after generation.");
          setStep("config");
          return;
        }

        setFlashcards(mappedCards);
        setStep("study");
        toast.success(`Generated ${mappedCards.length} new flashcards!`);
      }
    } catch (error: any) {
      console.error("Flashcard generation error", error);

      const status = error.response?.status;
      const msg = error.response?.data?.error || error.response?.data?.message;

      if (
        status === 503 ||
        (msg && String(msg).toLowerCase().includes("overloaded"))
      ) {
        toast.error("AI Model overloaded. Try again later or reduce amount.");
      } else {
        toast.error(msg || "Failed to generate flashcards");
      }
      setStep("config");
    }
  };

  const nextCard = () => {
    if (flashcards.length === 0) return;
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (flashcards.length === 0) return;
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    if (flashcards.length <= 1) return;
    const randomCard = Math.floor(Math.random() * flashcards.length);
    setCurrentCard(randomCard);
    setIsFlipped(false);
  };

  const markCardDifficulty = (cardId: number, level: "easy" | "hard") => {
    setDifficulty({ ...difficulty, [cardId]: level });
    setCompletedCards(new Set([...completedCards, cardId]));

    if (completedCards.size + 1 === flashcards.length) {
      setStep("complete");
    } else {
      // Auto-advance
      setTimeout(() => {
        if (currentCard < flashcards.length - 1) {
          nextCard();
        }
      }, 500);
    }
  };

  const resetSession = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setCompletedCards(new Set());
    setDifficulty({});
    setStep("study");
  };

  const handleBackToSelection = () => {
    resetSession();
    setStep("selection");
    setSelectedMaterial(null);
    setFlashcards([]);
    setQuantity(5);
  };

  const progressPercentage =
    (completedCards.size / (flashcards.length || 1)) * 100;
  const studyTimeMinutes = Math.floor((Date.now() - studyStartTime) / 60000);

  const easyCount = Object.values(difficulty).filter(
    (d) => d === "easy",
  ).length;
  const hardCount = Object.values(difficulty).filter(
    (d) => d === "hard",
  ).length;

  // Render Selection View
  if (step === "selection") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Study Flashcards
              </h1>
              <p className="text-gray-600 mt-1">
                Select a material to generate flashcards from
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingMaterials && (
              <div className="col-span-full text-center py-10">
                Loading materials...
              </div>
            )}

            {!loadingMaterials && materials.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No materials found. Upload some first!
              </div>
            )}

            {materials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleMaterialSelect(material)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                    <FileText size={24} />
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full uppercase">
                    {material.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                  {material.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-3">
                  <span>{material.subject || "General"}</span>
                  {material.pageCount && (
                    <>
                      <span>•</span>
                      <span>{material.pageCount} pages</span>
                    </>
                  )}
                </div>
                <button className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-medium group-hover:bg-red-600 group-hover:text-white transition-all flex items-center justify-center">
                  <Sparkles size={18} className="mr-2" />
                  Generate Cards
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Configuration View
  if (step === "config") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full shadow-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings2 size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Configure Study Set
            </h2>
            <p className="text-gray-600 mt-2">
              How many flashcards would you like to generate?
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cards (5-20)
              </label>
              <input
                type="number"
                min="5"
                max="20"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(5, Math.min(20, parseInt(e.target.value) || 5)),
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Fewer cards</span>
                <span>More cards</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("selection")}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartGeneration}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"
              >
                Start Generating
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Generating View
  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader2 size={40} className="text-red-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generating Flashcards...
          </h2>
          <p className="text-gray-600">
            Analyzing{" "}
            <span className="font-semibold">{selectedMaterial?.title}</span> and
            creating {quantity} flashcards.
          </p>
        </div>
      </div>
    );
  }

  // Render Completion View
  if (step === "complete") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
        <div className="max-w-2xl mx-auto text-center w-full">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Study Session Complete!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Great job! You've completed all {flashcards.length} flashcards.
          </p>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Session Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock size={24} className="text-gray-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {studyTimeMinutes}m
                </p>
                <p className="text-sm text-gray-500">Study Time</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Target size={24} className="text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{easyCount}</p>
                <p className="text-sm text-gray-500">Easy Cards</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Brain size={24} className="text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{hardCount}</p>
                <p className="text-sm text-gray-500">Difficult Cards</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={resetSession}
              className="w-full md:w-auto px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Study Again
            </button>

            <button
              onClick={handleBackToSelection}
              className="w-full md:w-auto px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Choose Another Material
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Crash Guard
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No flashcards loaded.</p>
          <button
            onClick={handleBackToSelection}
            className="text-red-600 font-medium"
          >
            Return to selection
          </button>
        </div>
      </div>
    );
  }

  // Render Study View
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center">
            <button
              onClick={handleBackToSelection}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 break-words line-clamp-2">
                {selectedMaterial?.title}
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Study set • {flashcards.length} cards
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="text-left md:text-right w-full md:w-auto">
            <p className="text-sm text-gray-500 mb-1">
              {currentCard + 1} of {flashcards.length} cards
            </p>
            <div className="w-full md:w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentCard + 1) / flashcards.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm text-gray-900 font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{completedCards.size} completed</span>
            <span>{flashcards.length - completedCards.size} remaining</span>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-6 md:mb-8">
          <div
            className="relative w-full min-h-[20rem] md:min-h-[24rem] cursor-pointer perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`
              relative w-full h-full transition-transform duration-500 preserve-3d
              ${isFlipped ? "rotate-y-180" : ""}
            `}
              style={{ minHeight: "inherit" }}
            >
              {/* Front */}
              <div className="absolute inset-0 bg-white rounded-2xl border border-gray-200 shadow-lg backface-hidden flex flex-col justify-center items-center p-6 md:p-8">
                <div className="text-center w-full">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Brain size={32} className="text-red-600" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 break-words">
                    {flashcards[currentCard].front}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        flashcards[currentCard].difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : flashcards[currentCard].difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {flashcards[currentCard].difficulty}
                    </span>
                    <span>•</span>
                    <span>{flashcards[currentCard].category}</span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Click to reveal answer
                  </p>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 bg-red-50 rounded-2xl border border-red-200 shadow-lg backface-hidden rotate-y-180 flex flex-col justify-center items-center p-6 md:p-8">
                <div className="text-center w-full overflow-y-auto max-h-full">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                    <Check size={32} className="text-red-600" />
                  </div>
                  <p className="text-lg md:text-xl text-gray-900 leading-relaxed mb-6">
                    {flashcards[currentCard].back}
                  </p>
                  <p className="text-gray-500 text-sm flex-shrink-0">
                    Click to flip back
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Actions */}
          {isFlipped && (
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markCardDifficulty(flashcards[currentCard].id, "hard");
                }}
                className="flex items-center px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
              >
                <X size={20} className="mr-2" />
                Hard
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markCardDifficulty(flashcards[currentCard].id, "easy");
                }}
                className="flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
              >
                <Check size={20} className="mr-2" />
                Easy
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            onClick={previousCard}
            disabled={currentCard === 0}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={shuffleCards}
              className="p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              title="Shuffle"
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={resetSession}
              className="p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <button
            onClick={nextCard}
            disabled={currentCard === flashcards.length - 1}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>

        {/* Study Tips */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Study Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Try to recall the answer before flipping the card</li>
            <li>• Mark cards as "Hard" if you struggled with them</li>
            <li>• Review difficult cards more frequently</li>
            <li>• Take breaks every 20-30 minutes for better retention</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
