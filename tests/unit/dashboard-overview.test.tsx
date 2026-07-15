import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardOverview } from "@/components/app/dashboard-overview";

describe("DashboardOverview", () => {
  it("renders the Week 3 dashboard shell and next actions", () => {
    render(<DashboardOverview />);

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Week 3 app shell")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /next setup step/i })).toHaveAttribute("href", "/profile");
    expect(screen.getByText("Jobs added")).toBeInTheDocument();
    expect(screen.getByText("Review items")).toBeInTheDocument();
  });
});
