import { Page } from '@playwright/test';
import { CommonLocators } from '../locators/common.locators';
import { assertPageHeading } from '../utils/assertions'
/**
 * Base page object shared by all TurboCore page objects.
 * Provides: login, logout, navigation, and a stub assertion helper.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Perform Auth0 login.
   * TODO: implement the full Auth0 redirect flow.
   * For speed, prefer storageState reuse via playwright.config.ts globalSetup.
   */
  async performLogin(email: string, password: string): Promise<void> {
    
    // TODO: wait for login page to load
    // await this.page.locator(CommonLocators.loginPage).waitFor({ state: 'visible' });
    // TODO: fill email + password fields (Auth0 form selectors needed)
    await this.page.goto('/api/v3/auth/login', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await assertPageHeading(this.page, 'Welcome');
    await this.page.locator(CommonLocators.emailInput).fill(email);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page.waitForTimeout(2000);  // Wait for password field to appear
    await this.page.locator(CommonLocators.passwordInput).fill(password);
    await this.page.locator(CommonLocators.continueBtn).click();
    // TODO: handle Auth0 redirect and wait for /v3/client landing
    await this.page.waitForURL('**/v3/client/**', { timeout: 120000 });
  }

  /**
   * Logout via top-right avatar menu.
   */
  async performLogout(): Promise<void> {
    await this.page.getByRole('button', { name: /account menu/i }).click();
    const logoutMenuItem = this.page.getByRole('menuitem', { name: /log\s*out|sign\s*out/i });
    if (await logoutMenuItem.isVisible({ timeout: 3000 })) {
      await logoutMenuItem.click();
      return;
    }

    await this.page.goto('/api/v3/auth/logout', { waitUntil: 'commit' });
    // TODO: wait for redirect back to /v3/login
    // await this.page.waitForURL('**/v3/login**');
  }

  /** Navigate to any path relative to baseURL. */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Placeholder assertion. Replace with real expect() calls.
   * @param description - human-readable description of what should be true.
   */
  async verifyExpectedOutcome(description: string): Promise<void> {
    // TODO: implement real assertion for: "${description}"
    // Example: await expect(this.page.locator('TODO-locator')).toBeVisible();
    void description; // suppress unused-variable warning until implemented
  }
}
