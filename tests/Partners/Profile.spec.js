import { test, expect } from '@playwright/test';
import { PayAccount, BaseURL, partnerLogin } from './PartnerAccounts.js';

// Test Data
const FirstName = 'Kinjal';
const LastName = 'Test';
const CountryCode = 'us';
const CountryOption = '🇺🇸 United States of America';
const ContactNumber = '7759802004';
const NewPassword = 'Test@123';
const ConfirmPassword = 'Test@123';

// Profile Firstname initial
const FirstNameInitial = FirstName.charAt(0);

// Expected country code options
const expectedOptions = [
    '🇬🇧 United Kingdom (+44)',
    '🇮🇪 Ireland (+353)',
    '🇺🇸 United States of America (+1)',
    '🇨🇦 Canada (+1)',
    '🇭🇰 Hong Kong (+852)',
];

// Test
test.beforeEach(async ({ page }) => {
    await PayAccount.PartnerLogin(page);
});

test('Edit profile, update password and verify', async ({ page }) => {

    // Navigate to Profile
    await page.getByRole('button', { name: 'K' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.waitForURL(`${BaseURL}user/profile`);
    await expect(page.locator('h1:visible')).toBeVisible();
    await page.getByRole('button', { name: 'Edit' }).click();

    // Update First & Last Name
    await page.getByRole('textbox', { name: 'First Name*' }).fill(FirstName);
    await page.getByRole('textbox', { name: 'Last Name*' }).click();
    await page.getByRole('textbox', { name: 'Last Name*' }).fill(LastName);

    // Navigate to Contact Details
    await page.getByRole('button', { name: 'Contact Details' }).click();
    await page.locator('h2').filter({ hasText: 'Contact Details' }).first().isVisible();

    // Validate all country code options
    await page.getByRole('combobox').click();
    const allOptions = page.getByRole('option');
    const actualOptions = (await allOptions.allTextContents()).map(opt => opt.trim());
    console.log(actualOptions);

    for (const optionText of expectedOptions) {
        expect(
            actualOptions,
            `Expected to find option: ${optionText}`
        ).toContain(optionText);
    }
    await expect(allOptions).toHaveCount(expectedOptions.length);
    console.log(`✅ All ${expectedOptions.length} country code options verified successfully!`);

    // Update Contact Number with Country Code
    await page.getByRole('combobox', { name: /Contact Number/ }).fill(CountryCode);
    await page.getByRole('option', { name: CountryOption }).click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill(ContactNumber);

    // Update Password
    await page.getByRole('button', { name: 'Security' }).click();
    await page.getByRole('button', { name: 'Update Password' }).click();
    await expect(page.locator('span:has-text("Update Password")')).toBeVisible();
    await page.getByRole('textbox', { name: 'Current Password*' }).fill(PayAccount.Password);
    await page.getByRole('textbox', { name: 'New Password*' }).fill(NewPassword);
    await page.getByRole('textbox', { name: 'Confirm Password*' }).fill(ConfirmPassword);
    await page.getByRole('button', { name: 'Update', exact: true }).click();
    await expect(page.locator('span:has-text("Update Password")')).toBeHidden();

    // Save and verify profile
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(`${BaseURL}user/profile`);
    await expect(page.getByText(FirstName, { exact: true })).toBeVisible();
    await expect(page.getByText(LastName, { exact: true })).toBeVisible();
    await expect(page.locator('span').filter({ hasText: ContactNumber.slice(-3) }).first()).toBeVisible();
    await expect(page.getByText(PayAccount.Email, { exact: true })).toBeVisible();

    // Click profile icon using first name initial and verify after save
    await page.getByRole('button', { name: FirstNameInitial }).click();
    await page.getByRole('link', { name: 'Logout' }).click();

    // Re-login with new password
    await page.waitForURL(`${BaseURL}login`);
    await partnerLogin(page, PayAccount.Email, NewPassword);
    const heading = page.locator('h1:visible');
    await expect(heading).toContainText(FirstName);
});

test('Profile Personal info and contact details validations', async ({ page }) => {
  await page.getByRole('button', { name: 'K' }).click();
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.waitForURL(`${BaseURL}user/profile`);
  await expect(page.locator('h1:visible')).toBeVisible();
  await page.getByRole('button', { name: 'Edit' }).click();

  // First and Last Name Required
  await page.getByRole('textbox', { name: 'First Name*' }).fill('   '); // whitespace-only -treated as empty
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('First Name is required')).toBeVisible();

  // Last Name required validation
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Last Name is required')).toBeVisible();

  // Verifying Max character length First name
  await page.getByRole('textbox', { name: 'First Name*' }).fill('a'.repeat(101));
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('The max character length is').first()).toBeVisible();

  // Verifying Max character length Last name
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('a'.repeat(101));
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('The max character length is').nth(1)).toBeVisible();

  // Personal Info Updating Correct values
  await page.getByRole('textbox', { name: 'First Name*' }).fill(FirstName);
  await page.getByRole('textbox', { name: 'Last Name*' }).fill(LastName);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('First Name is required')).not.toBeVisible();
  await expect(page.getByText('Last Name is required')).not.toBeVisible();
  await page.waitForURL(`${BaseURL}user/profile`);
  await expect(page.getByText(FirstName, { exact: true })).toBeVisible();
  await expect(page.getByText(LastName,  { exact: true })).toBeVisible();

  // Verify Required contact details
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('button', { name: 'Contact Details' }).click();

  await page.getByRole('textbox').clear();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Contact number required')).toBeVisible();

  // Verify Invalid contact number
  await page.getByRole('textbox').clear();
  await page.getByRole('textbox').fill('23252');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Valid phone number required')).toBeVisible();

  // Updating contact details with Valid phone number
  await page.getByRole('textbox').clear();
  await page.getByRole('textbox').fill(ContactNumber);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Contact number required')).not.toBeVisible();
  await expect(page.getByText('Valid phone number required')).not.toBeVisible();
  await page.waitForURL(`${BaseURL}user/profile`);
  await expect(page.locator('span').filter({ hasText: ContactNumber.slice(-3) }).first()).toBeVisible();
});

test('Update Password validations', async ({ page }) => {
  await page.getByRole('button', { name: 'K' }).click();
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.waitForURL(`${BaseURL}user/profile`);
  await expect(page.locator('h1:visible')).toBeVisible();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('button', { name: 'Security' }).click();
  await page.getByRole('button', { name: 'Update Password' }).click();

  // Verify Update Password title and empty fields 
  await expect(page.locator('span:has-text("Update Password")')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Current Password*' })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'New Password*' })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'Confirm Password*' })).toHaveValue('');
  await page.pause();

  // Password: required fields check
  await page.getByRole('button', { name: 'Update', exact: true }).click();
  await expect(page.getByText('Current Password is required')).toBeVisible();
  await expect(page.getByText('New Password is required')).toBeVisible();
  await page.pause();

  // Password: standard format check
  await page.getByRole('textbox', { name: 'Current Password*' }).fill('test');
  await page.getByRole('textbox', { name: 'New Password*' }).fill('test');
  await page.getByRole('button', { name: 'Update', exact: true }).click();
  await expect(page.getByLabel('Current Password*Password must have at least 8 characters')).toBeVisible();
  await expect(page.getByLabel('New Password*Password must have at least 8 characters')).toBeVisible();
  await page.pause();

  // Incorrect current Password - verify toast message for incorrect current password
    await page.locator('#modal-container').getByRole('button').filter({ hasText: /^$/ }).click();
    await page.getByRole('button', { name: 'Update Password' }).click();
    await page.getByRole('textbox', { name: 'Current Password* Password' }).fill('Test@1258999');
    await page.getByRole('textbox', { name: 'New Password*' }).fill('Test@1236');
    await page.getByRole('textbox', { name: 'Confirm Password*' }).fill('Test@1236');
    await page.getByRole('button', { name: 'Update', exact: true }).click();
      // Assert toast message for incorrect password
        await expect(page.getByText('Incorrect username or password.', { exact: true })).toBeVisible();
});