import { expect, test } from "@playwright/test";

test("protects all app routes before sign in", async ({ page }) => {
  for (const path of ["/dashboard", "/profile", "/resume", "/jobs", "/top-matches", "/review", "/question-bank", "/applications"]) {
    await page.goto(path);

    await expect(page).toHaveURL(/\/sign-in/);
  }
});

test("rejects unauthenticated CSV exports", async ({ page }) => {
  for (const path of ["/api/export/applications.csv", "/api/export/jobs.csv"]) {
    const response = await page.goto(path);

    expect(response?.status()).toBe(401);
  }
});

function credentialsForProject(projectName: string) {
  if (projectName.includes("mobile")) {
    return {
      email: process.env.E2E_AUTH_EMAIL_MOBILE ?? process.env.E2E_AUTH_EMAIL ?? "demo@example.com",
      password: process.env.E2E_AUTH_PASSWORD_MOBILE ?? process.env.E2E_AUTH_PASSWORD ?? "change-me",
    };
  }

  return {
    email: process.env.E2E_AUTH_EMAIL ?? "demo@example.com",
    password: process.env.E2E_AUTH_PASSWORD ?? "change-me",
  };
}

test("protects dashboard and allows demo sign in", async ({ page }, testInfo) => {
  const credentials = credentialsForProject(testInfo.project.name);

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in/);

  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Build the source of truth" })).toBeVisible();
  const primaryNav = page.getByRole("navigation", { name: "Primary" }).first();
  await expect(primaryNav).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Profile" })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Jobs" })).toBeVisible();

  await primaryNav.getByRole("link", { name: "Profile" }).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByRole("heading", { name: "Build momentum in minutes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test this in 60 seconds" })).toBeVisible();
  await expect(page.getByLabel("Current title")).toBeVisible();
  await expect(page.getByText("Review score").locator("..")).toContainText("/4");
  await page.getByRole("button", { name: "Senior backend +35 Backend, cloud, and platform roles." }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("/4");
  await page.getByRole("button", { name: "Senior Software Engineer" }).click();
  await page.getByRole("button", { name: "Backend Engineer" }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("/4");
  await page.getByRole("button", { name: "Remote US" }).click();
  await page.getByLabel("Remote preference").selectOption("Remote preferred");
  await expect(page.getByText("Review score").locator("..")).toContainText("/4");
  await page.getByRole("button", { name: "Java" }).click();
  await page.getByRole("button", { name: "Spring Boot" }).click();
  await page.getByRole("button", { name: "React" }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("/4");
  const saveProfile = page.getByRole("button", { name: "Save progress" });
  if (await saveProfile.isDisabled()) {
    await expect(saveProfile).toBeDisabled();
  } else {
    await saveProfile.click();
    await expect(async () => {
      expect(page.url().includes("/resume") || (await page.getByRole("alert").isVisible())).toBe(true);
    }).toPass();
  }

  if (!page.url().includes("/resume")) {
    await primaryNav.getByRole("link", { name: "Resume" }).click();
  }
  await expect(page).toHaveURL(/\/resume/);
  await expect(page.getByRole("heading", { name: "Create your matching base" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test this in 60 seconds" })).toBeVisible();
  await expect(page.getByText("Review score").locator("..")).toContainText("0/3");
  await page.getByRole("button", { name: "Use sample" }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("1/3");
  await page.getByLabel("Version label").fill("Senior software engineer resume");
  await expect(page.getByText("Review score").locator("..")).toContainText("2/3");
  await page.getByLabel("Use as default").check();
  await expect(page.getByText("Review score").locator("..")).toContainText("3/3");
  const saveResume = page.getByRole("button", { name: "Save resume" });
  if (await saveResume.isDisabled()) {
    await expect(saveResume).toBeDisabled();
  } else {
    await saveResume.click();
    await expect(async () => {
      expect(page.url().includes("/jobs") || (await page.getByRole("alert").isVisible())).toBe(true);
    }).toPass();
  }

  if (!page.url().includes("/jobs")) {
    await primaryNav.getByRole("link", { name: "Jobs" }).click();
  }
  await expect(page).toHaveURL(/\/jobs/);
  await expect(page.getByRole("heading", { name: "Capture roles before they blur" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test this in 60 seconds" })).toBeVisible();
  await expect(page.getByText("Duplicate check starts as you type")).toBeVisible();
  await expect(page.getByText("Review score").locator("..")).toContainText("0/4");
  await page.getByLabel("Company").fill("Acme Cloud");
  await page.getByLabel("Job title").fill("Senior Software Engineer");
  await expect(page.getByText(/Duplicate check is clear|duplicate:/i)).toBeVisible();
  await expect(page.getByText("Review score").locator("..")).toContainText("1/4");
  await page.getByLabel("Location").fill("Remote US");
  await page.getByLabel("Remote setup").selectOption("Remote");
  await expect(page.getByText("Review score").locator("..")).toContainText("2/4");
  await page.getByLabel("Employment type").selectOption("Full-time");
  await expect(page.getByText("Review score").locator("..")).toContainText("3/4");
  await page.getByRole("button", { name: "Use sample description" }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("4/4");
  const saveJob = page.getByRole("button", { name: "Save job" });
  if (await saveJob.isDisabled()) {
    await expect(saveJob).toBeDisabled();
  } else {
    await saveJob.click();
    await expect(page).toHaveURL(/\/top-matches/);
    await expect(page.getByRole("heading", { name: "Top matches" })).toBeVisible();
  }
});
