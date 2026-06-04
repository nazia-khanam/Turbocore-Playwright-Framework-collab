# CHANGE-PLAN

## Topic of this workstream
notifications

## Knowledge base sources used
- `Onboarding_Questionnaire_1.docx` — TurboCore app context, staging URL, user roles, notification feature overview, browser support.
- `2026-05-12_turbocore-feature-workflow.md` — current implementation state: mentions and sidebar badge live, bell icon not wired, non-mention triggers not fully defined.
- `scenarios (4).md` — client-provided 28 notification scenarios for this Playwright stub.

## Existing project state
Existing persistent Playwright project already contains BA topic files:
- `locators/ba.locators.ts`
- `pages/BaPage.ts`
- `tests/ba.spec.ts`

Shared files already present:
- `package.json`
- `playwright.config.ts`
- `.env.example`
- `locators/common.locators.ts`
- `pages/BasePage.ts`
- `data/test-data.ts`
- `utils/assertions.ts`
- `utils/helpers.ts`

## Files to ADD
- `locators/notifications.locators.ts`
- `pages/NotificationsPage.ts`
- `tests/notifications.spec.ts`

## Files to MODIFY
- `data/test-data.ts` — add notification-specific placeholder test data only.

## Files left UNTOUCHED
- `locators/ba.locators.ts`
- `pages/BaPage.ts`
- `tests/ba.spec.ts`
- `locators/common.locators.ts`
- `pages/BasePage.ts`
- `package.json`
- `playwright.config.ts`
- `.env.example`
- `utils/assertions.ts`
- `utils/helpers.ts`
