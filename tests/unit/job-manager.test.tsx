import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { JobManager } from "@/components/jobs/job-manager";

vi.mock("@/features/jobs/actions", () => ({
  createJobForm: vi.fn(),
}));

describe("JobManager", () => {
  it("renders preview mode and advances job progress one step at a time", () => {
    render(<JobManager databaseConfigured={false} jobs={[]} />);

    expect(screen.getByRole("heading", { name: "Add a job" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Test this in 60 seconds" })).toBeInTheDocument();
    expect(screen.getByText("0 saved")).toBeInTheDocument();
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("0/4");

    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Acme Cloud" } });
    fireEvent.change(screen.getByLabelText("Job title"), { target: { value: "Senior Software Engineer" } });
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("1/4");

    fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Remote US" } });
    fireEvent.change(screen.getByLabelText("Remote setup"), { target: { value: "Remote" } });
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("2/4");

    fireEvent.change(screen.getByLabelText("Employment type"), { target: { value: "Full-time" } });
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("3/4");

    fireEvent.click(screen.getByRole("button", { name: "Use sample description" }));
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("4/4");
    expect(screen.getByRole("button", { name: "Save job" })).toBeDisabled();
  });
});
