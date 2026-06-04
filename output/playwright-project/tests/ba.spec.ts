import { test } from '@playwright/test';
import { BaPage } from '../pages/BaPage';
import { testData } from '../data/test-data';

/**
 * TurboCore — BA Workstream Tests
 *
 * Source: Feature Workflow §3 "Workstreams — BA Mode" (Status: Live)
 * Environments: https://test.turbocore.soais.com (staging)
 *
 * STUB STATUS: all locators are TODO placeholders.
 * QA MUST complete locators/ba.locators.ts and locators/common.locators.ts
 * before any test here can pass.
 *
 * Tests: TC-BA-01 through TC-BA-11
 */

// ---------------------------------------------------------------------------
// TC-BA-01 / TC-BA-02 — Navigation & List
// ---------------------------------------------------------------------------
test.describe('BA Workstream — List & Navigation', () => {

  test('TC-BA-01: User can navigate to the BA workstream list', async ({ page }) => {
    const baPage = new BaPage(page);
    // TODO: replace with storageState once globalSetup is wired
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToBaList();
    // TODO: assert URL is /v3/client/ba and list container is visible
    await baPage.verifyExpectedOutcome('BA workstream list page is displayed');
  });

  test('TC-BA-02: BA list shows existing workstreams or empty state', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToBaList();
    // TODO: assert at least one workstream item OR empty-state message is visible
    await baPage.verifyExpectedOutcome('workstream items or empty-state message visible');
  });

});

// ---------------------------------------------------------------------------
// TC-BA-03 / TC-BA-04 — Workstream Creation
// ---------------------------------------------------------------------------
test.describe('BA Workstream — Creation', () => {

  test('TC-BA-03: User can create a new BA workstream', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToBaList();
    await baPage.openNewWorkstreamDialog();
    await baPage.fillWorkstreamTitle(testData.ba.newWorkstreamTitle);
    await baPage.submitNewWorkstream();
    // TODO: assert redirect to /v3/client/ba/chat/{id}
    await baPage.verifyExpectedOutcome('user lands on BA chat page after creation');
  });

  test('TC-BA-04: New workstream chat page loads with feed and send box', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToBaList();
    await baPage.openNewWorkstreamDialog();
    await baPage.fillWorkstreamTitle(testData.ba.newWorkstreamTitle);
    await baPage.submitNewWorkstream();
    // TODO: assert chat feed container and send box are both visible
    await baPage.verifyExpectedOutcome('chat feed and send box are visible on new workstream');
  });

});

// ---------------------------------------------------------------------------
// TC-BA-05 / TC-BA-06 / TC-BA-07 — Chat & Agent
// ---------------------------------------------------------------------------
test.describe('BA Workstream — Chat & Agent Interaction', () => {

  test('TC-BA-05: User sends first message; BA agent replies with a clarifying question', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToBaList();
    await baPage.openNewWorkstreamDialog();
    await baPage.fillWorkstreamTitle(testData.ba.newWorkstreamTitle);
    await baPage.submitNewWorkstream();
    await baPage.sendMessage(testData.ba.firstMessage);
    await baPage.waitForAgentResponse();
    await baPage.verifyExpectedOutcome('BA agent clarifying question visible in chat feed');
  });

  test('TC-BA-06: User sends multiple messages; each triggers an agent response', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    // TODO: navigate to a pre-existing workstream or dynamically create one
    await baPage.goToChat('TODO-workstream-id');
    for (const msg of testData.ba.followUpMessages) {
      await baPage.sendMessage(msg);
      await baPage.waitForAgentResponse();
    }
    await baPage.verifyExpectedOutcome('message/response pairs visible for each follow-up message');
  });

  test('TC-BA-07: User can stop a running dispatch; state stays clean', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToChat('TODO-workstream-id');
    // Trigger a dispatch then immediately stop it
    await baPage.sendMessage(testData.ba.firstMessage);
    // TODO: timing — Stop should be clicked before agent finishes; adjust if needed
    await baPage.stopDispatch();
    await baPage.verifyExpectedOutcome('dispatch cancelled; chat input re-enabled; no error state');
  });

});

// ---------------------------------------------------------------------------
// TC-BA-08 / TC-BA-09 — @-Mentions
// ---------------------------------------------------------------------------
test.describe('BA Workstream — @-Mentions', () => {

  test('TC-BA-08: Typing @<name> in chat input opens autocomplete and user can select', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToChat('TODO-workstream-id');
    await baPage.mentionTeammate(testData.ba.mentionPartialName);
    await baPage.verifyExpectedOutcome('@-mention chip rendered in send box after selection');
  });

  test('TC-BA-09: @-mention chip appears in message feed after message is sent', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToChat('TODO-workstream-id');
    await baPage.mentionTeammate(testData.ba.mentionPartialName);
    // TODO: the mention inserts the chip; send the full message
    await baPage.sendMessage(testData.ba.firstMessage); // TODO: combine with mention chip
    await baPage.verifyExpectedOutcome('@-mention chip visible as highlighted chip in the feed message');
  });

});

// ---------------------------------------------------------------------------
// TC-BA-10 / TC-BA-11 — Artifacts Panel
// ---------------------------------------------------------------------------
test.describe('BA Workstream — Artifacts Panel', () => {

  test('TC-BA-10: Right-rail Artifacts panel is visible on the chat page', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToChat('TODO-workstream-id');
    await baPage.verifyArtifactsPanelVisible();
    await baPage.verifyExpectedOutcome('artifacts panel container is rendered on screen');
  });

  test('TC-BA-11: ba-intake.md entry appears in Artifacts panel and updates in-place', async ({ page }) => {
    const baPage = new BaPage(page);
    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToChat('TODO-workstream-id');
    // Send a message so the BA agent writes to ba-intake.md
    await baPage.sendMessage(testData.ba.firstMessage);
    await baPage.waitForAgentResponse();
    // TODO: may need a short wait for the artifact write to propagate
    await baPage.verifyBaIntakeArtifactPresent();
    await baPage.verifyExpectedOutcome('single ba-intake.md entry in panel; no duplicate entries (upsert)');
  });

});
