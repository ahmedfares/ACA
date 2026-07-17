import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardOverview } from "@/components/app/dashboard-overview";

describe("DashboardOverview", () => {
  it("renders the Week 3 dashboard shell and next actions", () => {
    render(<DashboardOverview />);

    expect(screen.getByRole("heading", { name: "Build the source of truth" })).toBeInTheDocument();
    expect(screen.getByText("Today's job-search focus")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start with profile/i })).toHaveAttribute("href", "/profile");
    expect(screen.getByText("First value loop")).toBeInTheDocument();
    expect(screen.getByText("Add first job")).toBeInTheDocument();
  });
});
