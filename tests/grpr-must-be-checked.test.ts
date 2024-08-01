import { test} from '@playwright/test';
import { HomePage } from '../pageObjects/HomePage';
import { CareersPage } from '../pageObjects/CareersPage';

test('gdpr_must_be_checked', async ({ page }) => {
    const homePage = new HomePage(page);
    const careersPage = new CareersPage(page);

    await homePage.navigate();
    await homePage.goToCareersPage();

    await careersPage.contactForm.waitFor({ state: 'visible' });

    await careersPage.submitForm();

    await careersPage.checkErrorMessageVisible();
});
