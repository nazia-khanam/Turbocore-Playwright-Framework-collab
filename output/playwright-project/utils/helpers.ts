import { Page } from '@playwright/test';

/**
 * General-purpose helpers for TurboCore Playwright tests.
 */

/**
 * Wait for the page network to reach idle state.
 * Useful after navigation or after triggering a BA dispatch.
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Generate a unique workstream title to avoid collisions between test runs.
 * @example uniqueTitle('BA-smoke') // → 'BA-smoke-1716900123456'
 */
export function uniqueTitle(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

/**
 * Auth0 global session setup stub.
 * TODO: implement to perform login once and save storageState.
 *       Wire into playwright.config.ts as globalSetup.
 *
 * Reference: https://playwright.dev/docs/auth
 */
export async function setupAuth0Session(page: Page): Promise<void> {
  // TODO: 1. navigate to /v3/login
  // TODO: 2. complete Auth0 form
  // TODO: 3. await page.context().storageState({ path: 'playwright/.auth/user.json' });
  void page;
}
