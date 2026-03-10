// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: false,
  reporter: [['html', { open: 'always' }]],
  use: {
    trace: 'on',
  },

  projects: [
    {
      name: 'Partners',
      testDir: './tests/Partners',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Users',
      testDir: './tests/Users',
      use: { ...devices['Desktop Chrome'] },
    },
  ]
});