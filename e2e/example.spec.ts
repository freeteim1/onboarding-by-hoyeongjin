import { test, expect } from '@playwright/test';

test('메인 화면에 버튼이 보인다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /hello/i })).toBeVisible();
});
