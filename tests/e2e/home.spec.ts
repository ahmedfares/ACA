import { expect, test } from "@playwright/test";

test("loads the landing page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /know which jobs deserve your energy/i })).toBeVisible();
  await expect(page.getByText(/example outcome/i)).toBeVisible();
});
