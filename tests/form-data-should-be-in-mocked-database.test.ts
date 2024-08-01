import { test, expect } from '@playwright/test';
import { setupMock, mockDatabaseResponse, getMockClient } from '../utils/mock-db';
import { Client } from 'pg';
import sinon from 'sinon';
import { CareersPage } from '../pageObjects/CareersPage';

test.beforeAll(() => {
    setupMock();
    mockDatabaseResponse([
        {
            id: 1,
            name: 'Test Candidate',
            email: 'test.candidate@viableone.cz',
            phone: '111 222 333',
            message: 'Test Message.',
        },
    ]);
    sinon.stub(Client.prototype, 'query').callsFake(getMockClient().query);
});

test('form data should be stored in the mocked PostgreSQL database', async ({ page }) => {
    const careersPage = new CareersPage(page);

    // Open careers page with the form
    await careersPage.navigate();

    // Fill out the form
    await careersPage.
    fillContactForm('Test Candidate', 'test.candidate@viableone.cz', '111 222 333', 'Test Message.');

    // Upload a CV file in accepted format (.pdf,.docx,.doc,.txt,.rtf,.odt)
    await careersPage.uploadCV('data/test.pdf');

    // Approve GDPR
    await careersPage.approveGDPR();

    // Submit the form
    await careersPage.submitForm();

    // Verify db
    const result = await getMockClient().
    query('SELECT * FROM form_submissions WHERE name = "Test Candidate" AND email = "test.candidate@viableone.cz"');
    expect(result.rows).toEqual([
        {
            id: 1,
            name: 'Test Candidate',
            email: 'test.candidate@viableone.cz',
            phone: '111 222 333',
            message: 'Test Message.',
        },
    ]);
});
