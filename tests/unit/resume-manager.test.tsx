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
    expect(screen.getByText("Review score")).toBeInTheDocument();
    expect(screen.getByText("0 saved")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Use sample" }));

    expect(screen.getByLabelText("Version label")).toHaveValue("Senior software engineer resume");
    expect((screen.getByLabelText("Resume text") as HTMLTextAreaElement).value).toContain(
      "Senior Software Engineer",
    );
    expect(screen.getByText("Review score")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save resume" })).toBeDisabled();
  });
});
