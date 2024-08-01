import { test } from '@playwright/test';
import { CareersPage } from '../pageObjects/CareersPage';

test('fill-out-form', async ({ page }) => {
    const careersPage = new CareersPage(page);

    await careersPage.navigate();

    await careersPage.contactForm.waitFor({ state: 'visible' });
    await careersPage.fillContactForm('Test Candidate', 'test.candidate@viableone.cz', '111 222 333', 'Test Message.');
    await careersPage.uploadCV('/Users/dusan/desktop/test.pdf');
    await careersPage.approveGDPR();
    await careersPage.submitForm();

    await careersPage.checkModalSuccessfulVisible();
    await careersPage.closeModalWithOkButton();
});
