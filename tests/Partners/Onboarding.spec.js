import { test, expect } from '@playwright/test';
import { PaymentAcc } from './PaymentAcc';

test('Partners Onboarding through Email', async ({ page }) => {

    // Sign up details
    const Email = "kinjaltest22@test.com"
    const Password = "Test@1234";
    const FirstName = "Kinjal029";
    const LastName = "Test0029";
    const MobileNumber = "7822011255";
    // Sign-up Page
    await page.goto('https://partners.pata-app.net/sign-up');
    await page.getByRole('textbox').fill(Email);
    await page.locator("button[type='submit']").click();
    //Registration Page
    await page.locator("input[name='firstName']").fill(FirstName);
    await page.locator("input[name='lastName']").fill(LastName);
    await page.locator("input[name='mobile']").fill(MobileNumber);
    await page.locator("input[name='password']").fill(Password);
    await page.locator("input[name='confirmPassword']").fill(Password);
    await page.locator("button[type='submit']").click();
    // Business details
    await page.waitForURL('https://partners.pata-app.net/onboarding?section=business-details');
    await page.getByLabel('Business name').fill("Kinjal TestAccount");
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByText('Pet Grooming', { exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    // Address selection
    await page.getByRole('combobox', { name: 'Address line 1*' }).click();
    await page.getByRole('combobox', { name: 'Address line 1*' }).fill('nr322ed');
    const addressOption = page.getByRole('option', { name: 'North Quay Retail Park, Peto' });
    await expect(addressOption).toBeVisible();
    await addressOption.click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Next' }).click();
    // Business category selection
    await page.locator('div').filter({ hasText: /^Select the relevant category$/ }).nth(2).click();
    const categoryOption = page.getByRole('option', { name: 'Running all business' });
    await expect(categoryOption).toBeVisible();
    await categoryOption.click();
    await page.getByRole('button', { name: 'Next' }).click();
    // Referral source selection
    await page.locator('div').filter({ hasText: /^Tell us where you heard about Pata$/ }).nth(2).click();
    const referralOption = page.getByRole('option', { name: 'Contacted by Pata' });
    await expect(referralOption).toBeVisible();
    await referralOption.click();
    await page.getByRole('button', { name: 'Create' }).click();
    // Validating dashboard is fully loaded
    await page.waitForURL(/.*\/dashboard.*/);
    await expect(page.getByRole('heading', { name: `Good afternoon, ${FirstName}!` })).toBeVisible({ timeout: 30000 });
    await page.close();
});
