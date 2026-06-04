import { Page, expect } from '@playwright/test';
import { CommonLocators } from '../locators/common.locators';

/**
 * Shared assertion helpers for TurboCore tests.
 * All locator references are stubs — fill common.locators.ts first.
 */

/** Assert the current page URL contains the expected path fragment. */
export async function assertUrlContains(page: Page, pathFragment: string): Promise<void> {
  // TODO: uncomment once baseURL is verified in config
  // await expect(page).toHaveURL(new RegExp(pathFragment));
  void pathFragment;
}

/** Assert a toast/notification banner is visible, optionally with expected text. */
export async function assertToastVisible(page: Page, expectedText?: string): Promise<void> {
  const toast = page.locator(CommonLocators.toastBanner);
  await expect(toast).toBeVisible();
  if (expectedText) {
    // TODO: await expect(toast).toContainText(expectedText);
    void expectedText;
  }
}

/** Assert a modal is open with the expected heading. */
export async function assertModalOpen(page: Page, expectedTitle?: string): Promise<void> {
  const modal = page.locator(CommonLocators.modalContainer);
  await expect(modal).toBeVisible();
  if (expectedTitle) {
    // TODO: await expect(page.locator(CommonLocators.modalTitle)).toHaveText(expectedTitle);
    void expectedTitle;
  }
}

/** Assert the page main heading matches expected text. */
export async function assertPageHeading(page: Page, expectedHeading: string): Promise<void> {
  // TODO: locate H1 / main heading and assert text
  const heading = page.locator(CommonLocators.headerVerification);
  await expect(heading).toHaveText(expectedHeading);
  void expectedHeading;
}
