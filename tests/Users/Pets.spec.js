import { test, expect } from '@playwright/test';
import { Users } from './Accounts.js';

const pets = [
  { PetName: 'Bob', PetType: 'Cat', PetBreed: 'Bombay' }
];

const PetDOB = { year: '2024', month: '8', day: '12' };

test.beforeEach(async ({ page }) => {
  // User Login and navigation to Pets page
  await Users.Login(page);
  await page.locator(".sc-dYttxY.cKQOZM").click();
  await page.getByText('Pets', { exact: true }).click();
});

test('Verification of Add pet and pet data in the list', async ({ page }) => {
  const { PetName, PetType, PetBreed } = pets[0];
  await page.getByRole('button', { name: 'Add Pet' }).click();

  // Verifying heading on Add Pet page
  const heading = await page.locator('h1').filter({ hasText: 'Add Pet' }).first().textContent();
  expect(heading).toBe('Add Pet');

  // Filling Pet Name and DOB
  await page.getByRole('textbox', { name: 'Name*' }).fill(PetName);
  await page.getByRole('textbox', { name: 'Date of Birth' }).click();
  await page.getByLabel('Year:').selectOption(PetDOB.year);
  await page.getByLabel('Month:').selectOption(PetDOB.month);
  await page.getByRole('gridcell', { name: PetDOB.day }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Selection of Pet Type and Breed
  await expect(page.getByText('Dog')).toBeVisible();
  await page.getByText('Dog').click();
  await page.getByRole('option', { name: PetType }).click();
  await expect(page.locator('.css-uz4bii')).toBeVisible();
  await page.locator('.css-uz4bii').click();
  await page.locator('div.css-uz4bii:visible').click();
  await page.locator('.css-uz4bii').click();
  await page.getByRole('option', { name: PetBreed, exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Selection of Medical and Behavioural conditions
  await page.locator('.css-uz4bii').first().click();
  await page.getByRole('option', { name: 'Bad socialisation' }).click();
  await page.locator('.css-1d2w0w3 > .css-uz4bii').click();
  await page.getByRole('option', { name: 'Allergies' }).click();
  await page.getByRole('button', { name: 'Neutered/Spayed' }).click();
  await page.getByRole('button', { name: 'Microchipped' }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();

  // Verifying pets are displayed in the pet list
  const PetTile = page.locator('[class*="PetListItemContainer"]').filter({ hasText: PetName });
  await expect(PetTile).toBeVisible();
  await expect(PetTile.getByText(PetName)).toBeVisible();
  await expect(PetTile.getByText(PetBreed, { exact: false })).toBeVisible();
});