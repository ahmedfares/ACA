import type { ApplicationPackage } from "@/features/applications/schemas";

export const mockApplicationPackage: ApplicationPackage = {
  confidence: 84,
  coverLetter:
    "Dear hiring team,\n\nI am interested in this role because it aligns with my background building reliable product systems, partnering across functions, and improving production quality. My resume shows experience with backend services, cloud platforms, React, TypeScript, PostgreSQL, and pragmatic architecture decisions.\n\nFor this opportunity, I would emphasize my ability to own features end to end, communicate tradeoffs clearly, and improve system reliability without overstating any experience. I would welcome the chance to discuss how that background maps to the team needs described in the posting.\n\nSincerely,\nAhmed",
  keyPoints: [
    "Emphasize reliable backend and product engineering experience.",
    "Connect React, TypeScript, PostgreSQL, and cloud work to the role requirements.",
    "Mention cross-functional delivery and clear tradeoff communication.",
  ],
  questions: [
    {
      answer:
        "I improved reliability by tracing recurring issues, strengthening tests and alerts, and simplifying risky operational steps. I would adapt the details to the specific example I choose for this application.",
      category: "Behavioral",
      confidence: 72,
      question: "Tell us about a time you improved reliability.",
      status: "NeedsReview",
    },
  ],
  recruiterMessage:
    "Hi, I’m interested in the role. My background includes reliable backend systems, product-focused delivery, cloud platforms, React, TypeScript, and PostgreSQL. I’d be glad to compare my experience with the team’s needs.",
  reviewNotes: ["Review the reliability answer and replace generic wording with a specific approved story before submission."],
  tailoredSummary:
    "Position this application around reliable product engineering, backend depth, cloud experience, and cross-functional ownership. Keep claims anchored to the saved resume and avoid adding unstated domain or management experience.",
};
