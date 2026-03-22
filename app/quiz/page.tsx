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
    topGenres,
    progress,
    totalQuestions,
    answer,
    answers,
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
      });
      // 全回答をパラメータに含める（コンテキストペナルティ用）
      for (const [qId, choiceId] of Object.entries(answers)) {
        params.set(`q${qId}`, choiceId);
      }
      router.push(`/result?${params.toString()}`);
    }
  }, [isComplete, topGenres, scores, router, answers]);

  // 戻った時に前の回答を取得
  const previousAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  if (isComplete || !currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
            className="text-5xl mb-4"
          >
            🍽️
          </motion.div>
          <p className="text-[#8B6F61] font-medium">
            あなたにぴったりのお店を探しています...
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6] flex flex-col">
      <header className="flex items-center justify-between px-4 py-4">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`p-2 rounded-xl transition-all ${
            canGoBack
              ? "text-[#3d2e1f] hover:bg-white/60 active:scale-95"
              : "text-[#5C3D2E]/20 cursor-not-allowed"
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        <Link
          href="/"
          className="font-heading font-bold text-[#3d2e1f] text-base"
        >
          こんやのきぶん
        </Link>
        <div className="w-10" />
      </header>

      <ProgressBar
        current={currentIndex}
        total={totalQuestions}
        progress={progress}
      />

      <div className="flex-1 flex items-start justify-center pt-6 pb-16">
        <QuizCard
          question={currentQuestion}
          onAnswer={answer}
          questionNumber={currentIndex + 1}
          previousAnswer={previousAnswer}
        />
      </div>

      <div className="text-center pb-8 px-6">
        <p className="text-[11px] text-[#8B6F61]/50">
          タップして回答 ・ 戻るボタンでやり直し
        </p>
      </div>
    </main>
  );
}
