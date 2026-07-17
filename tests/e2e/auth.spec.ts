import { expect, test } from "@playwright/test";

test("protects dashboard and allows demo sign in", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in/);

  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByLabel("Password").fill("change-me");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  const primaryNav = page.getByRole("navigation", { name: "Primary" }).first();
  await expect(primaryNav).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Profile" })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Jobs" })).toBeVisible();

  await primaryNav.getByRole("link", { name: "Profile" }).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByRole("heading", { name: "Build momentum in minutes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test this in 60 seconds" })).toBeVisible();
  await expect(page.getByLabel("Current title")).toBeVisible();
  await expect(page.getByText("Review score").locator("..")).toContainText("0/4");
  await page.getByRole("button", { name: "Senior backend +35 Backend, cloud, and platform roles." }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("1/4");
  await page.getByRole("button", { name: "Senior Software Engineer" }).click();
  await page.getByRole("button", { name: "Backend Engineer" }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("2/4");
  await page.getByRole("button", { name: "Remote US" }).click();
  await page.getByLabel("Remote preference").selectOption("Remote preferred");
  await expect(page.getByText("Review score").locator("..")).toContainText("3/4");
  await page.getByRole("button", { name: "Java" }).click();
  await page.getByRole("button", { name: "Spring Boot" }).click();
  await page.getByRole("button", { name: "React" }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("4/4");
  await expect(page.getByRole("button", { name: "Save progress" })).toBeDisabled();

  await primaryNav.getByRole("link", { name: "Resume" }).click();
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
  await expect(page.getByRole("button", { name: "Save resume" })).toBeDisabled();

  await primaryNav.getByRole("link", { name: "Jobs" }).click();
  await expect(page).toHaveURL(/\/jobs/);
  await expect(page.getByRole("heading", { name: "Capture roles before they blur" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test this in 60 seconds" })).toBeVisible();
  await expect(page.getByText("Review score").locator("..")).toContainText("0/4");
  await page.getByLabel("Company").fill("Acme Cloud");
  await page.getByLabel("Job title").fill("Senior Software Engineer");
  await expect(page.getByText("Review score").locator("..")).toContainText("1/4");
  await page.getByLabel("Location").fill("Remote US");
  await page.getByLabel("Remote setup").selectOption("Remote");
  await expect(page.getByText("Review score").locator("..")).toContainText("2/4");
  await page.getByLabel("Employment type").selectOption("Full-time");
  await expect(page.getByText("Review score").locator("..")).toContainText("3/4");
  await page.getByRole("button", { name: "Use sample description" }).click();
  await expect(page.getByText("Review score").locator("..")).toContainText("4/4");
  await expect(page.getByRole("button", { name: "Save job" })).toBeDisabled();
});
