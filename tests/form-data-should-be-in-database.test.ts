import { test, expect } from '@playwright/test';
import { Client } from 'pg';
import { CareersPage } from '../pageObjects/CareersPage';
import testData from '../data/testData.json';
import dotenv from 'dotenv';
dotenv.config();

// Database connection setup
const client = new Client({
    user: process.env.USER,
    host: 'school-main-db.c1va2wi6vhre.eu-west-1.rds.amazonaws.com',
    database: 'viableone',
    password: process.env.PASSWORD,
    port: 5432,
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
        ['Test Candidate', 'test.candidate@viableone.cz']
    );

    // Ensure the database contains the expected row
    expect(result.rows).toEqual([
        {
            id: expect.any(Number), // Expecting any number for the id
            name: 'Test Candidate',
            email: 'test.candidate@viableone.cz',
            phone: '111 222 333',
            message: 'Test Message.',
        },
    ]);
});
