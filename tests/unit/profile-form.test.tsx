import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProfileForm } from "@/components/profile/profile-form";

vi.mock("@/features/profile/actions", () => ({
  saveProfileForm: vi.fn(),
}));

describe("ProfileForm", () => {
  it("renders core profile fields and disables save when database is not configured", () => {
    render(
      <ProfileForm
        databaseConfigured={false}
        defaults={{
          currentTitle: "Senior Engineer",
          preferredTitles: "Senior Engineer, Staff Engineer",
        }}
      />,
    );

    expect(screen.getByLabelText("Current title")).toHaveValue("Senior Engineer");
    expect(screen.getByLabelText("Preferred titles")).toHaveValue("Senior Engineer, Staff Engineer");
    expect(screen.getByText(/saving is disabled/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save profile" })).toBeDisabled();
  });
});
