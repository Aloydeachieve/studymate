"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Target,
  RefreshCw,
  FileText,
  Sparkles,
  Loader2,
  Settings2,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

// Local Interfaces
interface Material {
  id: string | number;
  title: string;
  subject: string;
  type: string;
  pageCount?: number;
  [key: string]: any;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
}

interface Results {
  correct: number;
  answered: number;
  percentage: number;
  totalPercentage: number;
}

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState<
    "selection" | "config" | "generating" | "quiz" | "results"
  >("selection");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );
  const [quantity, setQuantity] = useState<number>(5);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [quizStartTime] = useState<number>(Date.now());

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
      const searchParams = new URLSearchParams(window.location.search);
      const preSelectedId = searchParams.get("material");

      if (preSelectedId) {
        const found = mats.find(
          (m: any) => m.id.toString() === preSelectedId.toString(),
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
      // 1. Generate Quiz
      // API: POST /api/study-materials/{id}/generate-quiz
      const genResponse = await api.post(
        `/study-materials/${selectedMaterial.id}/generate-quiz`,
        {
          amount: quantity,
        },
      );

      // 2. Fetch quizzes/questions if success
      if (genResponse.status === 200 || genResponse.status === 201) {
        console.log("Quiz generation success, fetching questions...");
        // API: GET /api/study-materials/{id}/quizzes
        // User logs show this returns a list of questions, NOT quiz objects.
        const fetchResponse = await api.get(
          `/study-materials/${selectedMaterial.id}/quizzes`,
        );
        console.log("Quiz fetch response:", fetchResponse.data);

        const rawData = fetchResponse.data || [];
        let questionsData = [];

        if (Array.isArray(rawData)) {
          questionsData = rawData;
        } else if (rawData.questions && Array.isArray(rawData.questions)) {
          questionsData = rawData.questions;
        }

        if (questionsData.length === 0) {
          toast.error("Generation finished but no questions found.");
          setStep("config");
          return;
        }

        // Limit to the requested quantity, taking the MOST RECENT ones?
        // If the endpoint returns ALL history, we should slice the last N.
        // User mentioned flashcards do this, likely quizzes do too.
        const latestQuestions = questionsData.slice(-quantity);

        // Map the flat question objects to our frontend Question interface
        const mappedQuestions: Question[] = latestQuestions.map(
          (q: any, i: number) => {
            // Parse options: The log shows option_a, option_b...
            const options = [
              q.option_a,
              q.option_b,
              q.option_c,
              q.option_d,
            ].filter((o) => o !== null && o !== undefined && o !== ""); // Filter empty

            // Parse correct answer: Log shows "C", we need index.
            let correctIndex = 0;
            if (typeof q.correct_option === "string") {
              const charCode = q.correct_option.toUpperCase().charCodeAt(0);
              // 'A' is 65. 65-65=0, 66-65=1...
              correctIndex = charCode - 65;
            } else if (typeof q.correct_answer === "number") {
              correctIndex = q.correct_answer;
            }

            // Validate index bounds
            if (correctIndex < 0 || correctIndex >= options.length)
              correctIndex = 0;

            return {
              id: q.id || i,
              question: q.question,
              options: options,
              correctAnswer: correctIndex,
              explanation: q.explanation || "No explanation provided.",
            };
          },
        );

        if (mappedQuestions.length === 0) {
          toast.error("Could not parse quiz questions.");
          setStep("selection");
          return;
        }

        const generatedQuiz: Quiz = {
          id: `generated-${Date.now()}`,
          title: `Quiz: ${selectedMaterial.title}`,
          description: `A ${mappedQuestions.length}-question practice quiz.`,
          timeLimit: mappedQuestions.length * 60, // Default 1m per question
          questions: mappedQuestions,
        };

        setQuiz(generatedQuiz);
        setTimeLeft(generatedQuiz.timeLimit);
        setStep("quiz");
        toast.success("Quiz started!");
      }
    } catch (error: any) {
      console.error("Quiz generation failed", error);

      const status = error.response?.status;
      const msg = error.response?.data?.error || error.response?.data?.message;

      if (
        status === 503 ||
        (msg && String(msg).toLowerCase().includes("overloaded"))
      ) {
        toast.error("AI Model overloaded. Try again later.");
      } else {
        toast.error("Failed to generate quiz");
      }
      setStep("config");
    }
  };

  const handleFinishQuiz = useCallback(() => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: selectedAnswer as number,
    }));
    setStep("results");
  }, [currentQuestion, selectedAnswer]);

  // Timer effect
  useEffect(() => {
    if (step === "quiz" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step === "quiz") {
      handleFinishQuiz();
    }
  }, [timeLeft, step, handleFinishQuiz]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;

    setAnswers({
      ...answers,
      [currentQuestion]: selectedAnswer as number,
    });

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    setAnswers({
      ...answers,
      [currentQuestion]: selectedAnswer as number,
    });

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const calculateResults = (): Results => {
    if (!quiz)
      return { correct: 0, answered: 0, percentage: 0, totalPercentage: 0 };

    let correct = 0;
    let answered = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] !== undefined) {
        answered++;
        if (answers[index] === question.correctAnswer) {
          correct++;
        }
      }
    });

    const percentage =
      answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const totalPercentage = Math.round((correct / quiz.questions.length) * 100);

    return { correct, answered, percentage, totalPercentage };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setStep("quiz");
    if (quiz) setTimeLeft(quiz.timeLimit);
  };

  const handleBackToSelection = () => {
    setStep("selection");
    setSelectedMaterial(null);
    setQuiz(null);
    setQuantity(5);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Take a Quiz</h1>
              <p className="text-gray-600 mt-1">
                Select a material to generate a quiz from
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
                  Generate Quiz
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
            <h2 className="text-2xl font-bold text-gray-900">Configure Quiz</h2>
            <p className="text-gray-600 mt-2">
              How many questions would you like to attempt?
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions (5-20)
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
                <span>Fewer questions</span>
                <span>More questions</span>
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
                Start Quiz
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
            Generating Quiz...
          </h2>
          <p className="text-gray-600">
            Analyzing{" "}
            <span className="font-semibold">{selectedMaterial?.title}</span> and
            creating {quantity} questions.
          </p>
        </div>
      </div>
    );
  }

  // Render Results View
  if (step === "results" && quiz) {
    const results = calculateResults();
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6 md:mb-8">
            <button
              onClick={handleBackToSelection}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Quiz Results
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                {quiz.title}
              </p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy size={32} className="text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {results.totalPercentage}%
              </p>
              <p className="text-gray-500">Overall Score</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-red-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {results.correct}/{quiz.questions.length}
              </p>
              <p className="text-gray-500">Correct Answers</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-gray-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatTime(timeTaken)}
              </p>
              <p className="text-gray-500">Time Taken</p>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Question Review
            </h2>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                const wasAnswered = userAnswer !== undefined;

                return (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-xl p-4 md:p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-base md:text-lg font-medium text-gray-900 flex-1">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="ml-4 flex-shrink-0">
                        {!wasAnswered ? (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm text-gray-500">-</span>
                          </div>
                        ) : isCorrect ? (
                          <CheckCircle size={32} className="text-green-500" />
                        ) : (
                          <XCircle size={32} className="text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {question.options.map((option, optionIndex) => {
                        let classes =
                          "p-3 rounded-lg border text-left text-sm md:text-base ";

                        if (optionIndex === question.correctAnswer) {
                          classes +=
                            "bg-green-50 border-green-200 text-green-800";
                        } else if (optionIndex === userAnswer && !isCorrect) {
                          classes += "bg-red-50 border-red-200 text-red-800";
                        } else {
                          classes += "bg-gray-50 border-gray-200 text-gray-700";
                        }

                        return (
                          <div key={optionIndex} className={classes}>
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            {option}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw size={20} className="mr-2" />
              Retake Quiz
            </button>

            <button
              onClick={handleBackToSelection}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Choose Another Material
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Quiz View
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
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {quiz?.title}
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                {quiz?.description}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 self-start md:self-auto">
            <div className="flex items-center space-x-2">
              <Clock
                size={20}
                className={timeLeft < 60 ? "text-red-600" : "text-gray-600"}
              />
              <span
                className={`text-lg font-mono ${
                  timeLeft < 60 ? "text-red-600" : "text-gray-900"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-900 font-medium">
              {currentQuestion + 1} of {quiz?.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestion + 1) / (quiz?.questions.length || 1)) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
          <div className="mb-6 md:mb-8">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-red-600">
                  {currentQuestion + 1}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 pt-1">
                {quiz?.questions[currentQuestion].question}
              </h2>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-6 md:mb-8">
            {quiz?.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-colors ${
                  selectedAnswer === index
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === index
                        ? "border-red-500 bg-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-red-600 mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-gray-900 text-sm md:text-base">
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {Object.keys(answers).length + (selectedAnswer !== null ? 1 : 0)}{" "}
              of {quiz?.questions.length} answered
            </span>

            <button
              onClick={handleFinishQuiz}
              className="w-full sm:w-auto px-6 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors"
            >
              Finish Quiz
            </button>
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestion === (quiz?.questions.length || 0) - 1
              ? "Finish"
              : "Next"}
          </button>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Question Navigation
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
            {quiz?.questions.map((_, index) => {
              const isAnswered =
                answers[index] !== undefined ||
                (index === currentQuestion && selectedAnswer !== null);
              const isCurrent = index === currentQuestion;

              return (
                <button
                  key={index}
                  onClick={() => {
                    setAnswers({
                      ...answers,
                      [currentQuestion]: selectedAnswer as number,
                    });
                    setCurrentQuestion(index);
                    setSelectedAnswer(answers[index] || null);
                  }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 font-medium transition-colors text-sm md:text-base ${
                    isCurrent
                      ? "border-red-500 bg-red-500 text-white"
                      : isAnswered
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
