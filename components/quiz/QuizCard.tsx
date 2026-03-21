"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/types";

interface QuizCardProps {
  question: Question;
  onAnswer: (choiceId: string) => void;
  questionNumber: number;
}

export function QuizCard({ question, onAnswer, questionNumber }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(choiceId: string) {
    if (selected) return;
    setSelected(choiceId);
    setTimeout(() => {
      onAnswer(choiceId);
      setSelected(null);
    }, 400);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg mx-auto px-6"
      >
        <div className="mb-8">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs font-bold text-white bg-[#FF6B35] px-3 py-1 rounded-full mb-3"
          >
            Q{questionNumber}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-heading font-bold text-[#3d2e1f]"
          >
            {question.text}
          </motion.h2>
          {question.subtext && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-[#8B6F61]/70 mt-2"
            >
              {question.subtext}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.choices.map((choice, i) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              onClick={() => handleSelect(choice.id)}
              whileHover={selected === null ? { scale: 1.02 } : undefined}
              whileTap={selected === null ? { scale: 0.97 } : undefined}
              className={`
                flex items-center gap-4 p-4 md:p-5 rounded-2xl text-left
                transition-all duration-300
                ${
                  selected === choice.id
                    ? "bg-[#FF6B35]/10 border-2 border-[#FF6B35] shadow-md scale-[0.98]"
                    : selected !== null
                      ? "bg-white/30 border border-transparent opacity-40 cursor-not-allowed"
                      : "bg-white/70 border border-[#5C3D2E]/5 shadow-sm hover:bg-white hover:shadow-md hover:border-[#FF6B35]/20"
                }
              `}
            >
              <span className="text-3xl flex-shrink-0">{choice.emoji}</span>
              <span className="text-base font-medium text-[#3d2e1f]">
                {choice.text}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
