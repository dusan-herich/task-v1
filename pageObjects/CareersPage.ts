import {Page, Locator, expect} from '@playwright/test';

export class CareersPage {
    readonly page: Page;
    readonly contactForm: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly modalSuccessful: Locator;
    readonly fileInput: Locator;
    readonly gdprCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contactForm = page.locator('#careerContactForm');
        this.submitButton = this.contactForm.locator('button[type="submit"]');
        this.errorMessage = page.getByText('Je třeba zaškrtnout políčko Souhlasím se zpracováním osobních údajů');
        this.modalSuccessful = page.locator('#navigation-contact-dialog');
        this.fileInput = this.contactForm.locator('#cvFile');
        this.gdprCheckbox = this.contactForm.locator('#gdpr');
    }

    async navigate() {
        await this.page.goto('https://v1-web-git-test-viableone.vercel.app/kariera');
    }

    async fillContactForm(name: string, email: string, phone: string, message: string) {
        await this.contactForm.getByPlaceholder('Jméno a Příjmení').fill(name);
        await this.contactForm.getByPlaceholder('E-mail').fill(email);
        await this.contactForm.getByPlaceholder('Telefon').fill(phone);
        await this.contactForm.getByPlaceholder('Vaše zpráva').fill(message);
    }

    async uploadCV(filePath: string) {
        await this.fileInput.setInputFiles(filePath);
    }

    async approveGDPR() {
        await this.gdprCheckbox.check();
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async checkErrorMessageVisible() {
        await expect(this.errorMessage).toBeVisible();
    }

    async checkModalSuccessfulVisible() {
        await expect(this.modalSuccessful).toBeVisible();
    }

    async closeModalWithOkButton() {
        await this.page.click(`button[type="button"]`
            + `.btn.my-6.w-50.ContactForm_contact-form__button__EuaVy.btn.btn-contained`);
    }
}
