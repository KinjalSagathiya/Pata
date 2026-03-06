export const Users = {
  Email: 'hsh5x@soscandia.org',
  Password: 'Test@123',

  Login: async (page) => {
    await page.goto('https://pata-app.net/');
    await page.locator('button[class="sc-eVCCQc euCJGb"]').click();
    await page.locator('input[class="sc-hUPhBQ gJotik"]').fill(Users.Email);
    await page.locator('label span').click();
    await page.locator('button[class="sc-hARSoJ foAIuU"]').click();
    await page.getByLabel('Password').click();
    await page.locator('input[name="password"]').fill(Users.Password);
    await page.locator('form.sc-jyqoAZ.FSnFX').click();
    await page.getByText('Continue', { exact: true }).click();
  },
};