import { describe, expect, it } from "vitest";

import { listToText, parseProfileFormData, skillsToText } from "@/features/profile/form-data";

describe("profile form data", () => {
  it("parses profile form data into profile, preference, and skills inputs", () => {
    const formData = new FormData();
    formData.set("currentTitle", "  Senior Engineer ");
    formData.set("yearsExperience", "12");
    formData.set("industries", "Software, Cloud\nFintech");
    formData.set("preferredTitles", "Senior Engineer, Staff Engineer");
    formData.set("minCompensation", "150000");
    formData.set("desiredCompensation", "180000");
    formData.set("skills", "Java | Backend | Advanced | 10\nReact | Frontend | Advanced | 6");

    const parsed = parseProfileFormData(formData);

    expect(parsed.careerProfile.currentTitle).toBe("Senior Engineer");
    expect(parsed.careerProfile.yearsExperience).toBe(12);
    expect(parsed.careerProfile.industries).toEqual(["Software", "Cloud", "Fintech"]);
    expect(parsed.preference.preferredTitles).toEqual(["Senior Engineer", "Staff Engineer"]);
    expect(parsed.preference.minCompensation).toBe(150000);
    expect(parsed.preference.desiredCompensation).toBe(180000);
    expect(parsed.skills).toEqual([
      { category: "Backend", name: "Java", proficiency: "Advanced", years: 10 },
      { category: "Frontend", name: "React", proficiency: "Advanced", years: 6 },
    ]);
  });

  it("formats list and skills values for textarea defaults", () => {
    expect(listToText(["Remote", "Atlanta"])).toBe("Remote, Atlanta");
    expect(skillsToText([{ category: "Backend", name: "Java", years: 10 }])).toBe("Java | Backend | 10");
  });
});
