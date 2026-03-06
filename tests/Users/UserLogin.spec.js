import { test, expect } from '@playwright/test';
import { Users } from './Accounts.js';

test('User login through email', async ({ page }) => {
    const Email = Users.Email;
    const Password = Users.Password;
    await page.goto('https://pata-app.net/');
    await page.locator('button[class="sc-eVCCQc euCJGb"]').click();
    await page.locator('input[class="sc-hUPhBQ gJotik"]').fill(Email);
    await page.locator('label span').click();
    await page.locator('button[class="sc-hARSoJ foAIuU"]').click();
    await page.getByLabel('Password').click();
    await page.locator('input[name="password"]').fill(Password);
    await page.locator('form.sc-jyqoAZ.FSnFX').click();
    await page.getByText('Continue', { exact: true }).click();
    await page.locator('svg.sc-dYttxY.cKQOZM').click();
    await page.getByRole('link', { name: 'My Account' }).click();
    await page.waitForURL('https://pata-app.net/profile');
    await page.locator('.WelcomeName-sc-8f8qq7-5.huYxaq').textContent().then(text => {
        console.log(text);
        expect(text).toContain(`Welcome`);
    });
});