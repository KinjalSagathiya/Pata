import { expect } from '@playwright/test';

export const BaseURL = 'https://partners.pata-app.net/';

export const partnerLogin = async (page, email, password) => {
    await page.goto(`${BaseURL}login`);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(`${BaseURL}dashboard`);
};

export const PayAccount = {
    Email: 'w6e8w@virgilian.com',
    Password: 'Test@123',
    PartnerLogin: (page) => partnerLogin(page, PayAccount.Email, PayAccount.Password)
};

export const NoPayAccount = {
    Email: 'eo5hl@dollicons.com',
    Password: 'Test@123',
    PartnerLogin: (page) => partnerLogin(page, NoPayAccount.Email, NoPayAccount.Password)
};