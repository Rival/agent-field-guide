const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.SITE_URL || 'http://127.0.0.1:4173/',
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: process.env.SITE_URL ? undefined : {
    command: 'npm run serve',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: false,
  },
});
