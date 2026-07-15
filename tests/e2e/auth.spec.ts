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
});
