import { test } from '@playwright/test';
import { CareersPage } from '../pageObjects/CareersPage';

test('form_should_accept_valid_data', async ({ page }) => {
    const careersPage = new CareersPage(page);

    await careersPage.navigate();

    await careersPage.contactForm.waitFor({ state: 'visible' });
    await careersPage.fillContactForm('Test Candidate', 'test.candidate@viableone.cz', '111 222 333', 'Test Message.');
    await careersPage.uploadCV('data/test.pdf');
    await careersPage.approveGDPR();
    await careersPage.submitForm();

    await careersPage.checkModalSuccessfulVisible();
    await careersPage.closeModalWithOkButton();
});
