"use client";

import { useState, useCallback } from "react";
import { QUESTION_TREE } from "@/data/questionTree";
import type { EndpointNode, OptionNode } from "@/types";

type QuizState = {
  pathStack: string[];
  currentNodeId: string;
  answers: Record<string, string>; // nodeId -> optionId
  answerLabels: Record<string, { emoji: string; label: string }>; // nodeId -> display info
  endpoint: EndpointNode | null;
};

export function useQuizState() {
  const [state, setState] = useState<QuizState>({
    pathStack: ["q1"],
    currentNodeId: "q1",
    answers: {},
    answerLabels: {},
    endpoint: null,
  });

  const currentNode = QUESTION_TREE[state.currentNodeId] ?? null;

  const advance = useCallback((option: OptionNode) => {
    setState((prev) => {
      const newAnswers = { ...prev.answers, [prev.currentNodeId]: option.id };
      const newLabels = {
        ...prev.answerLabels,
        [prev.currentNodeId]: { emoji: option.emoji, label: option.label },
      };

      if (typeof option.next === "string") {
        return {
          pathStack: [...prev.pathStack, option.next],
          currentNodeId: option.next,
          answers: newAnswers,
          answerLabels: newLabels,
          endpoint: null,
        };
      } else {
        return {
          ...prev,
          answers: newAnswers,
          answerLabels: newLabels,
          endpoint: option.next,
        };
      }
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.pathStack.length <= 1) return prev;
      const newStack = prev.pathStack.slice(0, -1);
      const prevNodeId = newStack[newStack.length - 1];
      const newAnswers = { ...prev.answers };
      const newLabels = { ...prev.answerLabels };
      delete newAnswers[prev.currentNodeId];
      delete newLabels[prev.currentNodeId];
      return {
        pathStack: newStack,
        currentNodeId: prevNodeId,
        answers: newAnswers,
        answerLabels: newLabels,
        endpoint: null,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      pathStack: ["q1"],
      currentNodeId: "q1",
      answers: {},
      answerLabels: {},
      endpoint: null,
    });
  }, []);

  const canGoBack = state.pathStack.length > 1;
  const questionDepth = state.pathStack.length;

  return {
    state,
    currentNode,
    advance,
    goBack,
    reset,
    canGoBack,
    questionDepth,
  };
}
