import { test, expect } from '@playwright/test';
import { PaymentAcc } from './PaymentAcc';

const CategoryName = 'Health';
const ServiceName = 'Health Checkup';

test.beforeEach(async ({ page }) => {
  // Login before each test
  await PaymentAcc.login(page);
  // Navigate to Services
  await page.locator('[data-tooltip-id="catalogue"]').click();
  await page.locator('span', { hasText: 'Services' }).click();
  await page.pause();
});

test('Adding Service Category', async ({ page }) => {
  await page.locator('button', { hasText: 'Add' }).click();
  await page.getByText('Add Service Category', { exact: true }).click();

  // Validating the modal title
  await expect(page.getByText('Add Service Category', { exact: true })).toBeVisible();

  // Validation message for empty category name
  await page.getByText('Save', { exact: true }).click();
  await expect(page.getByLabel('Name*Name is required', { exact: true })).toBeVisible();

  // Validation check for Max character length in category name
  await page.locator('input[name="name"]').fill('A'.repeat(51));
  await page.getByText('Save', { exact: true }).click();
  await expect(page.getByText('Max character length is 50', { exact: true })).toBeVisible();

  // Service category creation with valid data
  await page.locator('input[name="name"]').fill(CategoryName);
  await page.locator('[name="description"]').fill('Health related services');
  await page.getByText('Save', { exact: true }).click();

  await page.waitForTimeout(3000);
});

test('Adding Service under the created category', async ({ page }) => {
  // Adding a new service
  await page.locator('button', { hasText: 'Add' }).click();
  await page.getByText('Add Service', { exact: true }).click();

  // Validating modal title
  await expect(page.locator('h1').filter({ hasText: 'Add Service' }).first()).toBeVisible();

  // Service First step.
  await page.locator('[name="name"]').fill(ServiceName);
  await page.locator('textarea[name="description"]').fill('Comprehensive health checkup package');
  await page.locator(':text-is("Select the relevant category")').click();
  await page.locator('.css-uz4bii').first().click();
  await page.getByRole('combobox', { name: 'Service Category* Group' }).fill(CategoryName);
  await page.getByRole('option', { name: CategoryName }).click();

  await page.locator('.css-dy0d3v-control > .css-1d2w0w3 > .css-uz4bii').click();
  await page.getByRole('combobox', { name: 'Service Type* Help your' }).fill('consultation');
  await page.getByRole('option', { name: 'Consultation', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Adding service price and Workplace selection.
  await page.getByRole('textbox', { name: 'Price* £' }).fill('20');
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByLabel('Kinjal - TestNorwich -').click();
  await page.locator('button').filter({ hasText: 'Workplace - newLowestoft - UK' }).click();
  await page.getByRole('button', { name: 'Next' }).dblclick();

  // Selection of Team members.
  await page.getByRole('button', { name: 'Basic UserNew Basic user', exact: true }).click();
  await page.getByRole('button', { name: 'Staff User Staff', exact: true }).click();
  await page.getByRole('button', { name: 'Kinjal Test Owner', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Selection of pet types and save service.
  await page.locator('.css-uz4bii').first().click();
  await page.getByRole('combobox', { name: 'Pet Type* 8 results available' }).fill('cat');
  await page.getByRole('option', { name: 'Cat' }).click();
  await page.locator('.css-uz4bii').first().click();
  await page.getByRole('combobox', { name: 'Pet Type* option Cat,' }).fill('dog');
  await page.getByRole('option', { name: 'Dog' }).click();

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(3000);
});