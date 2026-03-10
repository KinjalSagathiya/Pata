export const BaseURL = 'https://pata-app.net/';

const userLogin = async (page, email, password) => {
    await page.goto(BaseURL);
    await page.getByRole('button', { name: 'Login/Sign Up' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.locator('label span').click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.locator('form:visible').click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('banner').getByRole('button').click();
    await page.getByRole('link', { name: 'My Account' }).click();
};

export const Users = {
    Email: 'hsh5x@soscandia.org',
    Password: 'Test@123',
    UserLogin: (page) => userLogin(page, Users.Email, Users.Password)
};