import { test, expect } from '@playwright/test';
import { Client } from 'pg';
import { CareersPage } from '../pageObjects/CareersPage';
import testData from '../data/testData.json';
import dotenv from 'dotenv';
dotenv.config();

// Database connection setup
const client = new Client({
    user: process.env.USER,
    host: testData.database.host,
    database: testData.database.database,
    password: process.env.PASSWORD,
    port: testData.database.port,
});

test.beforeAll(async () => {
    await client.connect(); // Connect to the database
});

test.afterAll(async () => {
    await client.end(); // Disconnect from the database
});

test('form_data_should_be_stored_in_database', async ({ page }) => {
    const careersPage = new CareersPage(page);

    // Open careers page with the form
    await careersPage.navigate();

    // Fill out the form
    await careersPage.fillContactForm(testData.user.name, testData.user.email, testData.user.phone, testData.user.message);

    // Upload a CV file in accepted format (.pdf,.docx,.doc,.txt,.rtf,.odt)
    await careersPage.uploadCV('data/test.pdf');

    // Approve GDPR
    await careersPage.approveGDPR();

    // Submit the form
    await careersPage.submitForm();

    // Wait for some time if necessary, e.g., for the form to process
    await page.waitForTimeout(2000);

    // Verify data in the actual database
    const result = await client.query(
        'SELECT * FROM form_submissions WHERE name = $1 AND email = $2',
        [testData.user.name, testData.user.email]
    );

    // Ensure the database contains the expected row
    expect(result.rows).toEqual([
        {
            id: expect.any(Number), // Expecting any number for the ID - no knowledge about test db
            name: testData.user.name,
            email: testData.user.email,
            phone: testData.user.phone,
            message: testData.user.message,
        },
    ]);
});
