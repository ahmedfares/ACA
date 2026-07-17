import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResumeManager } from "@/components/resume/resume-manager";

vi.mock("@/features/resumes/actions", () => ({
  saveResumeForm: vi.fn(),
  setDefaultResumeForm: vi.fn(),
}));

describe("ResumeManager", () => {
  it("renders preview mode and updates the test checklist with the sample resume", () => {
    render(<ResumeManager databaseConfigured={false} resumes={[]} />);

    expect(screen.getByRole("heading", { name: "Default resume editor" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Test this in 60 seconds" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Instant resume signals" })).toBeInTheDocument();
    expect(screen.getByText("Your resume is sensitive")).toBeInTheDocument();
    expect(screen.getByText("Review score")).toBeInTheDocument();
    expect(screen.getByText("0 saved")).toBeInTheDocument();
    expect(screen.getByText("Upload PDF/DOCX later")).toBeDisabled();
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("0/3");

    fireEvent.click(screen.getByRole("button", { name: "Use sample" }));

    expect(screen.getByLabelText("Version label")).toHaveValue("");
    expect((screen.getByLabelText("Resume text") as HTMLTextAreaElement).value).toContain(
      "Senior Software Engineer",
    );
    expect(screen.getByText("Experience section").closest("div")).toHaveClass("border-primary/30");
    expect(screen.getByText("Skills or tools").closest("div")).toHaveClass("border-primary/30");
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("1/3");
    fireEvent.change(screen.getByLabelText("Version label"), { target: { value: "Senior software engineer resume" } });
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("2/3");
    fireEvent.click(screen.getByLabelText("Use as default"));
    expect(screen.getByText("Review score").parentElement).toHaveTextContent("3/3");
    expect(screen.getByRole("button", { name: "Save resume" })).toBeDisabled();
  });
});
