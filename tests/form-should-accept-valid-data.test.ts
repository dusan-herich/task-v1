import { test } from '@playwright/test';
import { CareersPage } from '../pageObjects/CareersPage';
import testData from '../data/testData.json';

test('form_should_accept_valid_data', async ({ page }) => {
    const careersPage = new CareersPage(page);

    await careersPage.navigate();

    await careersPage.contactForm.waitFor({ state: 'visible' });
    await careersPage.fillContactForm(testData.user.name, testData.user.email, testData.user.phone, testData.user.message);
    await careersPage.uploadCV('data/test.pdf');
    await careersPage.approveGDPR();
    await careersPage.submitForm();

    await careersPage.checkModalSuccessfulVisible();
    await careersPage.closeModalWithOkButton();
});
