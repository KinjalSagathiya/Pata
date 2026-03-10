import { test } from '@playwright/test';
import { PayAccount, NoPayAccount } from './PartnerAccounts';

test.describe('Partner Login Tests', () => {

    test('Login to Payments account', async ({ page }) => {
        await PayAccount.PartnerLogin(page);
        const heading = page.locator('h1:visible');
        console.log(await heading.textContent());
    });

    test('Login to account without payment', async ({ page }) => {
        await NoPayAccount.PartnerLogin(page);
        const heading = page.locator('h1:visible');
        console.log(await heading.textContent());
    });

});