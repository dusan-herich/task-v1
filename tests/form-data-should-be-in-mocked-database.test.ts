import { test, expect } from '@playwright/test';
import { setupMock, mockDatabaseResponse, getMockClient } from '../utils/mock-db';
import { Client } from 'pg';
import sinon from 'sinon';
import { CareersPage } from '../pageObjects/CareersPage';
import testData from '../data/testData.json';

test.beforeAll(() => {
    setupMock();
    mockDatabaseResponse([
        {
            id: 1,
            name: testData.user.name,
            email: testData.user.email,
            phone: testData.user.phone,
            message: testData.user.message,
        },
    ]);
    sinon.stub(Client.prototype, 'query').callsFake(getMockClient().query);
});

test('form_data_should_be_stored_in_mocked_database', async ({ page }) => {
    const careersPage = new CareersPage(page);

    // Open careers page with the form
    await careersPage.navigate();

    // Fill out the form
    await careersPage.
    fillContactForm(testData.user.name, testData.user.email, testData.user.phone, testData.user.message);

    // Upload a CV file in accepted format (.pdf,.docx,.doc,.txt,.rtf,.odt)
    await careersPage.uploadCV('data/test.pdf');

    // Approve GDPR
    await careersPage.approveGDPR();

    // Submit the form
    await careersPage.submitForm();

    // Verify db
    const result = await getMockClient().
    query(
        'SELECT * FROM form_submissions WHERE name = $1 AND email = $2',
        [testData.user.name, testData.user.email]
    );
    expect(result.rows).toEqual([
        {
            id: 1,
            name: testData.user.name,
            email: testData.user.email,
            phone: testData.user.phone,
            message: testData.user.message,
        },
    ]);
});
