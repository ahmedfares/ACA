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
  await expect(page.getByRole("button", { name: "Save progress" })).toBeDisabled();

  await primaryNav.getByRole("link", { name: "Resume" }).click();
  await expect(page).toHaveURL(/\/resume/);
  await expect(page.getByRole("heading", { name: "Create your matching base" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test this in 60 seconds" })).toBeVisible();
  await page.getByRole("button", { name: "Use sample" }).click();
  await expect(page.getByLabel("Version label")).toHaveValue("Senior software engineer resume");
  await expect(page.getByRole("button", { name: "Save resume" })).toBeDisabled();
});
