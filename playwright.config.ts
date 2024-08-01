import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        headless: true,
    },
    reporter: [
        ['list'], // Logs test results to the console
        ['html', { outputFolder: 'playwright-report' }], // Generates an HTML report
    ],
});
