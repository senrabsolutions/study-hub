import type { MDXComponents } from "mdx/types";
import Quiz from "@/components/Quiz";
import QuizSet from "@/components/QuizSet";

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    ...components,
    Quiz,
    QuizSet,
  };
}