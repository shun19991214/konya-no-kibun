"use client";

import { useState, useCallback } from "react";
import type { AxisScores, Choice } from "@/types";
import { QUESTIONS, INITIAL_SCORES } from "@/data/questions";
import { getTopThreeWithHistory } from "@/data/scoring";
import type { GenreId } from "@/types";

function addScores(a: AxisScores, b: AxisScores): AxisScores {
  return {
    heavyLight: a.heavyLight + b.heavyLight,
    wafuYofu: a.wafuYofu + b.wafuYofu,
    casualFormal: a.casualFormal + b.casualFormal,
    adventurous: a.adventurous + b.adventurous,
  };
}

function subtractScores(a: AxisScores, b: AxisScores): AxisScores {
  return {
    heavyLight: a.heavyLight - b.heavyLight,
    wafuYofu: a.wafuYofu - b.wafuYofu,
    casualFormal: a.casualFormal - b.casualFormal,
    adventurous: a.adventurous - b.adventurous,
  };
}

function getRecentGenres(): GenreId[] {
  if (typeof window === "undefined") return [];
  try {
    const history = JSON.parse(
      localStorage.getItem("yorugohan_history") || "[]"
    );
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return history
      .filter((h: { timestamp: number }) => h.timestamp > oneWeekAgo)
      .flatMap((h: { topGenres: GenreId[] }) => h.topGenres);
  } catch {
    return [];
  }
}

export function useQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<AxisScores>({ ...INITIAL_SCORES });

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const isComplete = currentIndex >= totalQuestions;
  const progress = Math.round((currentIndex / totalQuestions) * 100);

  const recentGenres = getRecentGenres();
  const topGenres = isComplete
    ? getTopThreeWithHistory(scores, recentGenres)
    : [];

  const answer = useCallback(
    (choiceId: string) => {
      const question = QUESTIONS[currentIndex];
      if (!question) return;

      const choice = question.choices.find(
        (c) => c.id === choiceId
      ) as Choice;
      if (choice?.scores) {
        setScores((prev) => addScores(prev, choice.scores));
      }

      setAnswers((prev) => ({ ...prev, [question.id]: choiceId }));
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex]
  );

  const goBack = useCallback(() => {
    if (currentIndex <= 0) return;

    const prevIndex = currentIndex - 1;
    const prevQuestion = QUESTIONS[prevIndex];
    const prevChoiceId = answers[prevQuestion.id];

    if (prevChoiceId) {
      const prevChoice = prevQuestion.choices.find(
        (c) => c.id === prevChoiceId
      ) as Choice;
      if (prevChoice?.scores) {
        setScores((prev) => subtractScores(prev, prevChoice.scores));
      }
    }

    setAnswers((prev) => {
      const next = { ...prev };
      delete next[prevQuestion.id];
      return next;
    });
    setCurrentIndex(prevIndex);
  }, [currentIndex, answers]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setScores({ ...INITIAL_SCORES });
  }, []);

  return {
    currentIndex,
    currentQuestion,
    answers,
    scores,
    isComplete,
    topGenres,
    progress,
    totalQuestions,
    answer,
    goBack,
    canGoBack: currentIndex > 0,
    reset,
  };
}
