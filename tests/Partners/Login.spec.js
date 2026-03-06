import { test, expect } from '@playwright/test';
import { PaymentAcc } from './PaymentAcc';

test('Login flow', async ({ page }) => {
  const email = PaymentAcc.email;
  const password = PaymentAcc.password;
  
  await page.goto('https://partners.pata-app.net/login');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('button[type="submit"]').click();
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/.*\/dashboard.*/);
  await expect(page.locator('h1:visible')).toBeVisible();
});
