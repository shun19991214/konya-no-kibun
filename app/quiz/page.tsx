"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizCard } from "@/components/quiz/QuizCard";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import Link from "next/link";

export default function QuizPage() {
  const router = useRouter();
  const {
    currentQuestion,
    currentIndex,
    isComplete,
    scores,
    range,
    topGenres,
    progress,
    totalQuestions,
    answer,
    goBack,
    canGoBack,
  } = useQuiz();

  useEffect(() => {
    if (isComplete && topGenres.length > 0) {
      const params = new URLSearchParams({
        hl: String(scores.heavyLight),
        wy: String(scores.wafuYofu),
        cf: String(scores.casualFormal),
        ad: String(scores.adventurous),
        range: String(range),
      });
      router.push(`/result?${params.toString()}`);
    }
  }, [isComplete, topGenres, scores, range, router]);

  if (isComplete || !currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-4xl mb-4 animate-float">🍽️</div>
          <p className="text-accent-light font-medium">
            あなたにぴったりのお店を探しています...
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-4 py-4">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`p-2 rounded-full transition-colors ${
            canGoBack
              ? "text-accent hover:bg-card"
              : "text-accent-light/30 cursor-not-allowed"
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        <Link
          href="/"
          className="font-heading font-bold text-primary text-lg"
        >
          🍽️ こんやのきぶん
        </Link>
        <div className="w-10" />
      </header>

      <ProgressBar
        current={currentIndex}
        total={totalQuestions}
        progress={progress}
      />

      <div className="flex-1 flex items-start justify-center pt-8 pb-16">
        <QuizCard
          question={currentQuestion}
          onAnswer={answer}
          questionNumber={currentIndex + 1}
        />
      </div>
    </main>
  );
}
