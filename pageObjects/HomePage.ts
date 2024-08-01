import { Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://v1-web-git-test-viableone.vercel.app');
    }

    async goToCareersPage() {
        await this.page.getByRole('navigation').getByRole('link', { name: 'Kariéra' }).click();
    }
}
