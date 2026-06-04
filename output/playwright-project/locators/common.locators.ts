/**
 * Common locators shared across ALL TurboCore page objects.
 * Every value is a TODO placeholder — QA must fill in real selectors.
 * Fix selectors HERE once; all page objects import from this file.
 *
 * Source: TurboCore Feature Workflow — shared chrome surfaces
 */
export const CommonLocators = {
  // ─── Sidebar Navigation ───────────────────────────────────────────────────
  sidebar: 'TODO-locator',   // main sidebar nav container
  sidebarBaLink: 'TODO-locator',   // Sidebar → BA
  sidebarQaLink: 'TODO-locator',   // Sidebar → QA
  sidebarFilesLink: 'TODO-locator',   // Sidebar → Files (KM)
  sidebarDashboardLink: 'TODO-locator',   // Sidebar → Dashboard
  sidebarThemeToggle: 'TODO-locator',   // theme toggle icon (bottom)

  // ─── Global Header ────────────────────────────────────────────────────────
  globalHeader: 'TODO-locator',
  notificationBell: 'TODO-locator',   // top-right bell (not yet wired in UI)
  avatarButton: 'button[type="button"][aria-haspopup="menu"]',   // top-right user avatar

  // ─── Auth ─────────────────────────────────────────────────────────────────
  loginPage: 'TODO-locator',   // /v3/login root container
  loginButton: 'TODO-locator',   // "Login" CTA on /v3/login
  logoutButton: 'div[role="menuitem"]>span',   // logout option in avatar menu
  logoVerification: 'header[id="screen-header"]>img',
  headerVerification: 'header[id="screen-header"]>h1',
  emailInput: 'input[id="username"]',
  passwordInput: 'input[id="password"]',
  continueBtn: 'button:has-text("Continue")',
  // ─── Toast / Notification Banner ─────────────────────────────────────────
  toastBanner: 'TODO-locator',
  toastMessage: 'TODO-locator',

  // ─── Modal Shell (generic) ────────────────────────────────────────────────
  modalContainer: 'TODO-locator',
  modalTitle: 'TODO-locator',
  modalConfirmButton: 'TODO-locator',
  modalCancelButton: 'TODO-locator',

  // ─── Primary Action Button ────────────────────────────────────────────────
  primaryButton: 'TODO-locator',   // brand CTA (green / primary colour)
} as const;
