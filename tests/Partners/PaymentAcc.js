export const PaymentAcc = {
  email: "w6e8w@virgilian.com",
  password: "Test@123",

  login: async (page) => {

    await page.goto('https://partners.pata-app.net/login');
    await page.locator('input[type="email"]').fill(PaymentAcc.email);
    await page.locator('button[type="submit"]').click();
    await page.locator('input[type="password"]').fill(PaymentAcc.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/.*\/dashboard.*/);
    await expect(page.locator('h1:visible')).toBeVisible();

  }
};