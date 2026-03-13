import { test, expect } from '@playwright/test';
import { BaseURL, PayAccount } from '../PartnerAccounts';

test.describe('Account settings', () => {

    const accountName = 'KinjalAcc';
    const firstName = 'Kinjal FN';
    const lastName = 'Test LN';
    const accountType = 'Self-Employed';
    const vatNumber = '2589545';
    const timeZone = 'Europe/London';
    const timeFormat = '12 hour';

    test.beforeEach(async ({ page }) => {
        await PayAccount.PartnerLogin(page);
    });

    test('Edit account details and Billing information', async ({ page }) => {
        // Navigate to Settings
        await page.locator('a:nth-child(11)').click();
        await page.waitForURL(`${BaseURL}settings/account`, { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded');
        const editButton = page.getByRole('button', { name: 'Edit' });
        await expect(editButton).toBeVisible({ timeout: 15000 });
        await editButton.click();

        // Fill General Info
        const accountNameInput = page.getByRole('textbox', { name: 'Account Name* Your friendly' });
        await expect(accountNameInput).toBeVisible();
        await accountNameInput.fill(accountName);
        await expect(accountNameInput).toHaveValue(accountName);

        // Validate Date & Time fields are disabled
        await page.getByRole('button', { name: 'Date & Time' }).click();
        await expect(page.getByLabel('Time Zone*')).toBeVisible();
        await expect(page.getByLabel('Time Zone*')).toBeDisabled();
        await expect(page.getByText(timeFormat)).toBeVisible();

        // Fill Billing details
        await page.getByRole('button', { name: 'Billing' }).click();
        await expect(page.getByLabel('Account Type')).toBeVisible();

        // Verify all account types are visible in the dropdown
        const expectedAccountTypes = ['Individual', 'Company', 'Self-Employed'];

        await page.getByLabel('Account Type').click();
        const allAccountOptions = page.getByRole('option');
        const actualAccountOptions = await allAccountOptions.allTextContents();

        for (const optionText of expectedAccountTypes) {
            expect(
                actualAccountOptions,
                `Expected to find account type: ${optionText}`
            ).toContain(optionText);
        }
        await expect(allAccountOptions).toHaveCount(expectedAccountTypes.length);
        console.log(`✅ All ${expectedAccountTypes.length} account type options verified successfully!`);

        // Fill First and Last Name
        await page.getByRole('textbox', { name: 'First Name*' }).fill(firstName);
        await page.getByRole('textbox', { name: 'Last Name*' }).fill(lastName);

        // Fill VAT Tax details
        const vatInput = page.getByRole('textbox', { name: 'VAT Number' });
        await expect(vatInput).toBeVisible();
        await vatInput.fill(vatNumber);
        await expect(vatInput).toHaveValue(vatNumber);

        // Click Save and wait for API response
        const saveButton = page.getByRole('button', { name: 'Save' });
        await expect(saveButton).toBeEnabled();
        const responsePromise = page.waitForResponse(
            resp => resp.url().includes('/api/accounts/') && (resp.status() === 200 || resp.status() === 304),
            { timeout: 10000 }
        ).catch(() => null);
        await saveButton.click();
        await responsePromise;

        // Navigate to account settings page and wait for content to render
        await page.goto(`${BaseURL}settings/account`, { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('heading', { name: 'General Info' })).toBeVisible();

        // Verify General Info with Updated Account Name
        await expect(page.getByText(accountName, { exact: true })).toBeVisible();

        // Verify Date & Time section displays correct values
        const dateTimeSection = page.getByRole('heading', { name: 'Date & Time' }).locator('..').locator('..');
        await expect(dateTimeSection).toBeVisible();
        await expect(dateTimeSection.getByText('Time Zone')).toBeVisible();
        await expect(dateTimeSection.locator('span').filter({ hasText: timeZone }).first()).toBeVisible();
        await expect(dateTimeSection.getByText('Time Format')).toBeVisible();
        //await expect(dateTimeSection.locator('span').filter({ hasText: timeFormat }).first()).toBeVisible();

        // Verify Billing Details with updated values
        const billingSection = page.getByRole('heading', { name: 'Billing Details' }).locator('..').locator('..');
        await expect(billingSection.locator('span').filter({ hasText: accountType }).first()).toBeVisible();
        await expect(page.locator('span').filter({ hasText: firstName }).first()).toBeVisible();
        await expect(page.locator('span').filter({ hasText: lastName }).first()).toBeVisible();

        // Verify VAT Tax with updated values
        const taxSection = page.locator('h2:has-text("Tax")').locator('../..');
        await expect(taxSection).toBeVisible();
        await expect(taxSection.getByText('VAT Number')).toBeVisible();
        await expect(taxSection.getByText(vatNumber, { exact: true })).toBeVisible();
    });
});