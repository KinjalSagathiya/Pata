import { test, expect } from '@playwright/test';
import { Users } from './Accounts.js';

const pets = [
  { PetName: 'Bob', PetType: 'Cat', PetBreed: 'Bombay' }
];

const PetDOB = { year: '2024', month: '8', day: '12' };

test.beforeEach(async ({ page }) => {
  await Users.UserLogin(page);
  await page.getByRole('link', { name: 'Pets Click to view and edit' }).click();
});

test('Verification of Add pet and pet data in the list', async ({ page }) => {
  const { PetName, PetType, PetBreed } = pets[0];

  await page.getByRole('button', { name: 'Add Pet' }).click();

  // Verify Add Pet heading
  const heading = await page.locator('h1').filter({ hasText: 'Add Pet' }).first().textContent();
  expect(heading).toBe('Add Pet');

  // Fill pet name and DOB
  await page.getByRole('textbox', { name: 'Name*' }).fill(PetName);
  await page.getByRole('textbox', { name: 'Date of Birth' }).click();
  await page.getByLabel('Year:').selectOption(PetDOB.year);
  await page.getByLabel('Month:').selectOption(PetDOB.month);
  await page.getByRole('gridcell', { name: PetDOB.day }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Select pet type only if it's not the default 'Dog'
  if (PetType !== 'Dog') {
    await page.locator('div').filter({ hasText: /^Dog$/ }).first().click();
    await page.getByRole('option', { name: PetType, exact: false }).click();
    // Wait for breed dropdown to reset after type change
    await expect(page.getByText('Select a breed', { exact: true })).toBeVisible();
    await page.waitForTimeout(2000);
  }
  // Select breed
  await page.locator('div').filter({ hasText: /^Select a breed$/ }).nth(1).click();
  await page.getByRole('option', { name: PetBreed, exact: true }).click();
  // Select gender
  await page.locator('div').filter({ hasText: /^Select\.\.\.$/ }).nth(1).click();
  await page.getByRole('option', { name: 'Not known' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.pause();
  // Behaviors
  await page.getByRole('combobox').nth(0).click();
  await page.getByRole('option', { name: 'Biting' }).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Allergies' }).click();
  await page.getByRole('button', { name: 'Neutered/Spayed' }).click();
  await page.getByRole('button', { name: 'Microchipped' }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.waitForTimeout(3000);
  // Reloading the pet list by navigation from profile page
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByRole('link', { name: 'Pets Click to view and edit' }).click();
  const petCard = page.locator('div').filter({has: page.getByRole('heading', { name: PetName, exact: true })}).first();
  // Verify pet name heading is visible within the card
  await expect(petCard.getByRole('heading', { name: PetName, exact: true })).toBeVisible();
  await petCard.getByRole('heading', { name: PetName, exact: true }).click();
  // Verify breed is visible in the pet card
  await expect(
    petCard.locator('p').filter({ hasText: PetBreed }).first()).toBeVisible();
 await page.close();
});