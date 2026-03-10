import { test, expect } from '@playwright/test';
import { Users } from './Accounts.js';

test.describe('User Login Tests', () => {

    test.beforeEach(async ({ page }) => {
        await Users.UserLogin(page);
    });

    test('User login through email', async ({ page }) => {
        const heading = page.locator('h1:visible');
        const text = await heading.textContent();
        console.log(text);
        expect(text).toContain('Welcome');
    });

});