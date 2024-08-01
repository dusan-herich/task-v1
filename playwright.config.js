// playwright.config.js
module.exports = {
    use: {
        headless: false, // Run in headful mode
        launchOptions: {
            // Don't close the browser automatically
            slowMo: 1000, // Optional: slow down actions to observe them
        },
    },
};
