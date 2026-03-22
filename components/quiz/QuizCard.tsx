"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/types";

interface QuizCardProps {
  question: Question;
  onAnswer: (choiceId: string) => void;
  questionNumber: number;
  previousAnswer?: string;
}

export function QuizCard({ question, onAnswer, questionNumber, previousAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(choiceId: string) {
    if (selected) return;
    setSelected(choiceId);
    setTimeout(() => {
      onAnswer(choiceId);
      setSelected(null);
    }, 300);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0.6, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg mx-auto px-6"
      >
        <div className="mb-8">
          <span className="inline-block text-xs font-bold text-white bg-[#FF6B35] px-3 py-1 rounded-full mb-3">
            Q{questionNumber}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#3d2e1f]">
            {question.text}
          </h2>
          {question.subtext && (
            <p className="text-sm text-[#8B6F61]/70 mt-2">
              {question.subtext}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.choices.map((choice, i) => {
            const isPreviousAnswer = previousAnswer === choice.id;
            return (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0.5, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                onClick={() => handleSelect(choice.id)}
                whileHover={selected === null ? { scale: 1.02 } : undefined}
                whileTap={selected === null ? { scale: 0.97 } : undefined}
                className={`
                  flex items-center gap-4 p-4 md:p-5 rounded-2xl text-left
                  transition-all duration-200
                  ${
                    selected === choice.id
                      ? "bg-[#FF6B35]/10 border-2 border-[#FF6B35] shadow-md scale-[0.98]"
                      : selected !== null
                        ? "bg-white/30 border border-transparent opacity-40 cursor-not-allowed"
                        : isPreviousAnswer
                          ? "bg-[#FF6B35]/5 border-2 border-[#FF6B35]/30 shadow-sm"
                          : "bg-white/70 border border-[#5C3D2E]/5 shadow-sm hover:bg-white hover:shadow-md hover:border-[#FF6B35]/20"
                  }
                `}
              >
                <span className="text-3xl flex-shrink-0">{choice.emoji}</span>
                <span className="text-base font-medium text-[#3d2e1f]">
                  {choice.text}
                </span>
                {isPreviousAnswer && selected === null && (
                  <span className="ml-auto text-[10px] text-[#FF6B35] font-bold">
                    前回の回答
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
