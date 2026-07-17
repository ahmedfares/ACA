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

  it("shows explainable duplicate warnings against saved jobs", () => {
    render(
      <JobManager
        databaseConfigured
        jobs={[
          {
            company: "Acme Cloud",
            createdAt: new Date("2026-07-17"),
            description:
              "Senior Software Engineer role focused on React, TypeScript, PostgreSQL, cloud services, product partnership, and reliable customer experiences.",
            id: "job-1",
            jobUrl: "https://jobs.example.com/acme/123?utm_source=linkedin",
            location: "Remote US",
            status: "Discovered",
            title: "Senior Software Engineer",
            updatedAt: new Date("2026-07-17"),
          },
        ]}
      />,
    );

    expect(screen.getByText("Duplicate check starts as you type")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Acme Cloud Inc." } });
    fireEvent.change(screen.getByLabelText("Job title"), { target: { value: "Senior Software Engineer" } });
    fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Remote United States" } });

    expect(screen.getByText(/Probable duplicate/)).toBeInTheDocument();
    expect(screen.getByText("Same company, title, and location")).toBeInTheDocument();
    expect(screen.getByText(/Closest match: Acme Cloud - Senior Software Engineer/)).toBeInTheDocument();
  });

  it("extracts obvious job details from pasted descriptions without overwriting filled fields", () => {
    render(<JobManager databaseConfigured={false} jobs={[]} />);

    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Already Set" } });
    fireEvent.change(screen.getByLabelText("Job description"), {
      target: {
        value:
          "Job: Senior Platform Engineer\nCompany: Acme Cloud\nLocation: Remote US\nThis is a full-time remote role paying $140,000-$190,000 for platform engineering and reliable developer tooling.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Extract obvious details" }));

    expect(screen.getByLabelText("Company")).toHaveValue("Already Set");
    expect(screen.getByLabelText("Job title")).toHaveValue("Senior Platform Engineer");
    expect(screen.getByLabelText("Location")).toHaveValue("Remote US");
    expect(screen.getByLabelText("Remote setup")).toHaveValue("Remote");
    expect(screen.getByLabelText("Employment type")).toHaveValue("Full-time");
    expect(screen.getByLabelText("Salary min")).toHaveValue(140000);
    expect(screen.getByLabelText("Salary max")).toHaveValue(190000);
  });
});
