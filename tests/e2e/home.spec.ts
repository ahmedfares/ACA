import { expect, test } from "@playwright/test";

test("loads the landing page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /find better-fit jobs/i })).toBeVisible();
  await expect(page.getByText(/quality over volume/i)).toBeVisible();
});
