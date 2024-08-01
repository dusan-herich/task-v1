import { defineConfig } from '@playwright/test';

module.exports = {
    use: {
        headless: true,
    },
};

export default defineConfig({
    reporter: [
        ['list'], //
        ['html', { outputFolder: 'playwright-report' }],
    ],
});

