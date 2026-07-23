export type MatchableAnswer = {
  answer: string;
  category?: string | null;
  id: string;
  normalizedQuestion?: string | null;
  question: string;
  reusePolicy: string;
  tags: string[];
};

export type QuestionMatchResult = {
  answer: MatchableAnswer;
  score: number;
  strategy: string;
};

const stopWords = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "can",
  "did",
  "do",
  "for",
  "how",
  "i",
  "in",
  "is",
  "me",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "this",
  "to",
  "we",
  "what",
  "when",
  "where",
  "why",
  "with",
  "you",
  "your",
]);

export function normalizeQuestion(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensFor(question: string) {
  return normalizeQuestion(question)
    .split(" ")
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function overlapScore(left: string[], right: string[]) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const intersection = [...leftSet].filter((token) => rightSet.has(token)).length;
  const union = new Set([...leftSet, ...rightSet]).size;

  if (union === 0) {
    return 0;
  }

  const jaccard = intersection / union;
  const coverage = intersection / Math.max(1, Math.min(leftSet.size, rightSet.size));

  return Math.round(jaccard * 60 + coverage * 40);
}

function strategyFor(score: number, normalizedQuestion: string, answerQuestion: string) {
  if (normalizedQuestion === normalizeQuestion(answerQuestion)) {
    return "Exact approved question";
  }

  if (score >= 80) {
    return "Strong reusable match";
  }

  if (score >= 55) {
    return "Likely reusable with edits";
  }

  return "Weak keyword overlap";
}

export function matchApprovedAnswers(question: string, answers: MatchableAnswer[], limit = 3): QuestionMatchResult[] {
  const normalizedQuestion = normalizeQuestion(question);
  const questionTokens = tokensFor(question);

  if (!normalizedQuestion || questionTokens.length === 0) {
    return [];
  }

  return answers
    .map((answer) => {
      const answerQuestion = answer.normalizedQuestion || answer.question;
      const score =
        normalizedQuestion === normalizeQuestion(answerQuestion)
          ? 100
          : overlapScore(questionTokens, tokensFor(answerQuestion));

      return {
        answer,
        score,
        strategy: strategyFor(score, normalizedQuestion, answerQuestion),
      };
    })
    .filter((match) => match.score >= 35)
    .sort((left, right) => right.score - left.score || left.answer.question.localeCompare(right.answer.question))
    .slice(0, limit);
}
