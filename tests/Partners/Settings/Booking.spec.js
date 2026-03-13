import { expect, test } from "@playwright/test";
import { PayAccount, BaseURL } from "../PartnerAccounts";

const TimeInterval = '1 hour';
const MinNoticePeriod = '1 hour';
const MaxBookingPeriod = '6 months';

test.describe('Account settings', () => {
    test.beforeEach(async ({ page }) => {
        await PayAccount.PartnerLogin(page);
    });

    test('Update online booking', async ({ page }) => {
        await page.locator('a:nth-child(11)').click();
        await page.waitForURL(`${BaseURL}settings/account`);
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('button', { name: 'Booking' }).click();
        await expect(page.getByRole('heading', { name: 'Booking', exact: true })).toBeVisible();
        await page.getByRole('button', { name: 'Edit' }).click();
        await expect(page.locator('h1').filter({ hasText: 'Edit booking settings' }).first()).toBeVisible();
        await expect(page.locator('h2').filter({ hasText: 'Online booking' }).first()).toBeVisible();

        // Select Online booking time interval
        const timeIntervalCombobox = page.getByRole('combobox', { name: 'Online booking time interval*' });
        await timeIntervalCombobox.click();
        await timeIntervalCombobox.fill(TimeInterval);
        await page.getByRole('option', { name: TimeInterval, exact: true }).click();

        // Toggle Team member selection
        await page.locator('button.sc-hBgdUx').click();

        // Select Minimum booking notice period
        const minNoticeCombobox = page.getByRole('combobox', { name: 'Minimum booking notice*' });
        await minNoticeCombobox.click();
        await minNoticeCombobox.fill(MinNoticePeriod);
        await page.getByRole('option', { name: MinNoticePeriod, exact: true }).click();

        // Select Maximum booking period
        const maxBookingCombobox = page.getByRole('combobox', { name: 'Maximum booking period*' });
        await maxBookingCombobox.click();
        await maxBookingCombobox.fill(MaxBookingPeriod);
        await page.getByRole('option', { name: MaxBookingPeriod, exact: true }).click();

        // Register response listener BEFORE clicking Save
        const responsePromise = page.waitForResponse(
            resp => resp.url().includes('/api/settings/account/booking') && (resp.status() === 200 || resp.status() === 304),
            { timeout: 10000 }
        ).catch(() => null);

        await page.locator('button').filter({ hasText: 'Save' }).first().click();
        await responsePromise;

        await page.waitForURL(`${BaseURL}settings/booking`);
        await page.waitForLoadState('domcontentloaded');

        // Verify Online booking section displays updated values
        await expect(page.locator('h2').filter({ hasText: 'Online booking' }).first()).toBeVisible();

        await expect(
            page.locator('div')
                .filter({ has: page.getByText('Online booking time interval', { exact: true }) })
                .locator('span')
                .last()
        ).toContainText(TimeInterval);

        await expect(
            page.locator('div')
                .filter({ has: page.getByText('Team member selection', { exact: true }) })
                .locator('span')
                .last()
        ).toContainText('Enabled');

        await expect(
            page.locator('div')
                .filter({ has: page.getByText('Minimum booking notice', { exact: true }) })
                .locator('span')
                .last()
        ).toContainText(MinNoticePeriod);

        await expect(
            page.locator('div')
                .filter({ has: page.getByText('Maximum booking period', { exact: true }) })
                .locator('span')
                .last()
        ).toContainText(MaxBookingPeriod);
    });
});