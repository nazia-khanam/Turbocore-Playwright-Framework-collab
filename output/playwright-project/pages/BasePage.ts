import { expect, Page } from '@playwright/test';
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
    await this.page.goto('/api/v3/auth/login', { waitUntil: 'domcontentloaded', timeout: 120000 });

    const emailField = this.page.locator('input[type="email"], input[type="text"], input[placeholder*="email" i], input[placeholder*="username" i]').first();
    if (await emailField.isVisible({ timeout: 15000 }).catch(() => false)) {
      await emailField.fill(email);
    } else {
      const altEmailField = this.page.getByLabel(/email|username|login/i).first();
      await expect(altEmailField).toBeVisible({ timeout: 15000 });
      await altEmailField.fill(email);
    }

    const continueButton = this.page.getByRole('button', { name: /continue|next|sign in|log in/i }).first();
    if (await continueButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueButton.click();
    }

    const passwordField = this.page.locator('input[type="password"], input[placeholder*="password" i], input[aria-label*="password" i]').first();
    await expect(passwordField).toBeVisible({ timeout: 20000 });
    await passwordField.fill(password);

    const submitButton = this.page.getByRole('button', { name: /sign in|log in|submit|continue/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    await submitButton.click();

    await this.page.waitForURL('**/v3/client/**', { timeout: 120000 });
    await this.page.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => undefined);
  }

  /**
   * Logout via top-right avatar menu.
   */
  async performLogout(): Promise<void> {
    const profileButton = this.page.getByRole('button', { name: /account|profile|avatar|user/i }).first();
    if (await profileButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await profileButton.click();
      const logoutMenuItem = this.page.getByRole('menuitem', { name: /log\s*out|sign\s*out|logout|signout/i }).first();
      if (await logoutMenuItem.isVisible({ timeout: 5000 }).catch(() => false)) {
        await logoutMenuItem.click();
        return;
      }
    }

    await this.page.goto('/api/v3/auth/logout', { waitUntil: 'commit', timeout: 120000 });
    await this.page.waitForURL('**/v3/login**', { timeout: 120000 }).catch(() => undefined);
  }

  /** Navigate to any path relative to baseURL. */
  async navigateTo(path: string): Promise<void> {
    const maxAttempts = 3;
    let attempt = 0;
    const timeout = 300000; // 5 minutes
    while (attempt < maxAttempts) {
      try {
        attempt++;
        await this.page.goto(path, { waitUntil: 'load', timeout });
        return;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`navigateTo attempt ${attempt} failed for ${path}: ${err}`);
        if (attempt >= maxAttempts) throw err;
        // exponential backoff before retrying
        const backoffMs = 2000 * attempt;
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }
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
