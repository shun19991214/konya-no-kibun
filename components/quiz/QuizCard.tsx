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
            className="inline-block text-sm font-medium text-primary mb-2"
          >
            Q{questionNumber}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-heading font-bold text-accent"
          >
            {question.text}
          </motion.h2>
          {question.subtext && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-accent-light/60 mt-1"
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
              transition={{ delay: 0.2 + i * 0.06 }}
              onClick={() => handleSelect(choice.id)}
              whileHover={selected === null ? { scale: 1.02 } : undefined}
              whileTap={selected === null ? { scale: 0.98 } : undefined}
              className={`
                flex items-center gap-4 p-4 rounded-2xl text-left
                transition-all duration-300
                ${
                  selected === choice.id
                    ? "warm-card-selected"
                    : selected !== null
                      ? "warm-card-disabled"
                      : "warm-card"
                }
              `}
            >
              <span className="text-2xl flex-shrink-0">{choice.emoji}</span>
              <span className="text-base font-medium text-accent">
                {choice.text}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
