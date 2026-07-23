import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardOverview } from "@/components/app/dashboard-overview";

describe("DashboardOverview", () => {
  it("renders the Week 3 dashboard shell and next actions", () => {
    render(
      <DashboardOverview
        topMatches={[
          {
            company: "Acme Cloud",
            confidence: 84,
            createdAt: new Date("2026-07-23"),
            hardCriteriaResult: "Pass",
            id: "score-1",
            jobId: "job-1",
            location: "Remote US",
            overall: 81,
            rank: 1,
            reasonsToApply: ["Strong backend fit."],
            recommendation: "Apply",
            title: "Senior Backend Engineer",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Build the source of truth" })).toBeInTheDocument();
    expect(screen.getByText("Today's job-search focus")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start with profile/i })).toHaveAttribute("href", "/profile");
    expect(screen.getByText("First value loop")).toBeInTheDocument();
    expect(screen.getByText("Add first job")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Top matches preview" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Senior Backend Engineer/ })).toHaveAttribute("href", "/jobs/job-1");
  });
});
