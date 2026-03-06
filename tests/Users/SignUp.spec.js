import { test, expect } from '@playwright/test';

test('User sign up through email', async ({ page }) => {

    const Email = "testuser3@example.com";
    const Password = "Test@123";
    const FirstName = "Test";
    const LastName = "User";

    await page.goto('https://pata-app.net/');
    await page.locator('button[class="sc-eVCCQc euCJGb"]').click();
    await page.locator('input[class="sc-hUPhBQ gJotik"]').fill(Email);
    await page.locator('label span').click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.waitForTimeout(3000);
    const Heading = await page.locator('div[class="sc-eJZSpO gybOIZ"] h2').textContent();
    expect(Heading).toBe('Sign up to Pata');
    console.log(Heading);
// Fill in the registration form and Register the user
    await page.locator('[name="firstName"]').fill(FirstName);
    await page.locator('[name="lastName"]').fill(LastName);
    await page.locator('input[type="tel"]').fill('7822011289');
    await page.locator('[name="password"]').fill(Password);
    await page.locator('[name="confirmPassword"]').fill(Password);
    await page.locator('div.sc-QsWun.cDmqLU').click();
    await page.locator('button:has-text("Register")').click();
    await page.locator('svg.sc-dYttxY.cKQOZM').waitFor({ state: 'visible' });
    await page.locator('svg.sc-dYttxY.cKQOZM').click();
    await page.getByRole('link', { name: 'My Account' }).click();
    const welcomeLocator = page.locator('.WelcomeName-sc-8f8qq7-5.huYxaq');
    await welcomeLocator.waitFor({ state: 'visible', timeout: 30000 });
    const welcomeText = await welcomeLocator.textContent();
    console.log(welcomeText);
    expect(welcomeText).toContain(`Welcome ${FirstName} ${LastName}`);

});