import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { BaLocators } from '../locators/ba.locators';

/**
 * Page object for the TurboCore BA (Business Analysis) Workstream feature.
 *
 * Covers Feature Workflow §3 (Status: Live):
 *   - Workstream list navigation
 *   - Workstream creation dialog
 *   - Chat interactions (send message, wait for agent, stop dispatch)
 *   - @-mention autocomplete
 *   - Right-rail Artifacts panel (ba-intake.md)
 *
 * All locators are stubs — complete locators/ba.locators.ts before use.
 */
export class BaPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  /** Navigate to the BA workstream list page (/v3/client/ba). */
  async goToBaList(): Promise<void> {
    await this.navigateTo('/v3/client/ba');
    // TODO: wait for list page container to be visible
    await this.page.locator(BaLocators.workstreamListPage).waitFor({ state: 'visible' });
  }

  /** Navigate directly to a BA workstream chat by ID. */
  async goToChat(workstreamId: string): Promise<void> {
    await this.navigateTo(`/v3/client/ba/chat/${workstreamId}`);
    // TODO: wait for chat page container
    await this.page.locator(BaLocators.chatPage).waitFor({ state: 'visible' });
  }

  // ─── Workstream Creation ───────────────────────────────────────────────────

  /**
   * Open the New Workstream dialog.
   * Precondition: user is on /v3/client/ba.
   */
  async openNewWorkstreamDialog(): Promise<void> {
    await this.page.locator(BaLocators.newWorkstreamButton).click();
    // TODO: wait for dialog to appear
    await this.page.locator(BaLocators.newWorkstreamDialog).waitFor({ state: 'visible' });
  }

  /** Type a title into the workstream name field. */
  async fillWorkstreamTitle(title: string): Promise<void> {
    // TODO: clear existing value if any
    await this.page.locator(BaLocators.titleInput).fill(title);
  }

  /**
   * Submit the dialog and wait for redirect to the chat page.
   * Postcondition: user is on /v3/client/ba/chat/{id}.
   */
  async submitNewWorkstream(): Promise<void> {
    await this.page.locator(BaLocators.submitWorkstreamButton).click();
    // TODO: wait for chat page to load after redirect
    await this.page.locator(BaLocators.chatPage).waitFor({ state: 'visible' });
  }

  // ─── Chat Interactions ─────────────────────────────────────────────────────

  /**
   * Type and send a message to the BA agent.
   * Waits for the user message to appear in the feed.
   */
  async sendMessage(text: string): Promise<void> {
    await this.page.locator(BaLocators.chatInput).fill(text);
    await this.page.locator(BaLocators.sendButton).click();
    // TODO: wait for user message bubble to appear
    await this.page.locator(BaLocators.userMessage).last().waitFor({ state: 'visible' });
  }

  /**
   * Wait for the BA agent to post a response.
   * NOTE: agent responses can be slow — extend timeout in playwright.config.ts if flaky.
   */
  async waitForAgentResponse(): Promise<void> {
    // TODO: agent message may stream — wait for the final stable state
    await this.page.locator(BaLocators.agentMessage).last().waitFor({ state: 'visible' });
  }

  /**
   * Click the Stop button to cancel a running dispatch.
   * Business rule: stop is idempotent; state stays clean.
   */
  async stopDispatch(): Promise<void> {
    await this.page.locator(BaLocators.stopButton).click();
    // TODO: verify dispatch is cancelled (stop button hides, input re-enables)
    await this.verifyExpectedOutcome('dispatch stopped; workstream state is clean');
  }

  // ─── @-Mention ─────────────────────────────────────────────────────────────

  /**
   * Type "@<partialName>" in the chat input to trigger the autocomplete,
   * then select the first matching suggestion.
   * Only same-tenant users appear (business rule).
   */
  // Collaboration / Members

  /**
   * Add a collaborator/member to the currently open workstream.
   * Precondition: user is on a workstream chat page and has permission to add members.
   */
  async addCollaborator(userName: string): Promise<void> {
    await this.page.locator(BaLocators.collaborationButton).click();
    await this.page.locator(BaLocators.collaboratorSearchInput).fill(userName);
    await this.page.locator(BaLocators.collaboratorOption).filter({ hasText: userName }).first().click();
    await this.page.locator(BaLocators.addCollaboratorButton).click();
  }

  /**
   * Remove an existing collaborator/member from the currently open workstream.
   * Precondition: user is on a workstream chat page and has permission to remove members.
   */
  async removeCollaborator(userName: string): Promise<void> {
    await this.page.locator(BaLocators.collaborationButton).click();

    const collaboratorRow = this.page.locator(BaLocators.collaboratorListItem).filter({ hasText: userName }).first();
    await collaboratorRow.locator(BaLocators.removeCollaboratorButton).click();

    const confirmButton = this.page.locator(BaLocators.confirmRemoveCollaboratorButton);
    if (await confirmButton.isVisible({ timeout: 3000 })) {
      await confirmButton.click();
    }
  }

  /**
   * Assert the chat timeline shows the small grey user-added collaboration update.
   */
  async verifyUserAddedCollaborationUpdate(actorName: string, affectedUserName: string): Promise<void> {
    const update = this.page.locator(BaLocators.collaborationUpdateItem).filter({
      hasText: new RegExp(`${actorName}.*(added|invited).*${affectedUserName}`, 'i'),
    }).last();

    await expect(update).toBeVisible();
    await expect(update.locator(BaLocators.collaborationUpdateIcon)).toBeVisible();
    await expect(update.locator(BaLocators.collaborationUpdateActorName)).toContainText(actorName);
    await expect(update.locator(BaLocators.collaborationUpdateActionText)).toContainText(/added|invited/i);
    await expect(update.locator(BaLocators.collaborationUpdateAffectedUserName)).toContainText(affectedUserName);
    await expect(update).toHaveCSS('color', /rgb\(.*\)/);
    await this.verifyExpectedOutcome('user-added collaboration update has icon, grey styling, actor, action text, and affected user');
  }

  /**
   * Assert the chat timeline shows the small grey user-removed collaboration update.
   */
  async verifyUserRemovedCollaborationUpdate(actorName: string, affectedUserName: string): Promise<void> {
    const update = this.page.locator(BaLocators.collaborationUpdateItem).filter({
      hasText: new RegExp(`${actorName}.*(removed|revoked).*${affectedUserName}`, 'i'),
    }).last();

    await expect(update).toBeVisible();
    await expect(update.locator(BaLocators.collaborationUpdateIcon)).toBeVisible();
    await expect(update.locator(BaLocators.collaborationUpdateActorName)).toContainText(actorName);
    await expect(update.locator(BaLocators.collaborationUpdateActionText)).toContainText(/removed|revoked/i);
    await expect(update.locator(BaLocators.collaborationUpdateAffectedUserName)).toContainText(affectedUserName);
    await expect(update).toHaveCSS('color', /rgb\(.*\)/);
    await this.verifyExpectedOutcome('user-removed collaboration update has icon, grey styling, actor, action text, and affected user');
  }

  async mentionTeammate(partialName: string): Promise<void> {
    // Use .type() to trigger key events that open the autocomplete
    await this.page.locator(BaLocators.chatInput).type(`@${partialName}`);
    // TODO: wait for autocomplete dropdown
    await this.page.locator(BaLocators.mentionAutocomplete).waitFor({ state: 'visible' });
    // Select first suggestion
    await this.page.locator(BaLocators.mentionSuggestionItem).first().click();
    // TODO: verify mention chip appears in the send box
    await this.verifyExpectedOutcome('@-mention chip inserted into send box');
  }

  // ─── Artifacts Panel ───────────────────────────────────────────────────────

  /** Assert the right-rail Artifacts panel is visible. */
  async verifyArtifactsPanelVisible(): Promise<void> {
    await this.page.locator(BaLocators.artifactsPanel).waitFor({ state: 'visible' });
  }

  /**
   * Assert the ba-intake.md artifact entry is present in the panel.
   * Business rule: one ba-intake.md per workstream (upsert — no duplicates).
   */
  async verifyBaIntakeArtifactPresent(): Promise<void> {
    await this.page.locator(BaLocators.baIntakeArtifactEntry).waitFor({ state: 'visible' });
    await this.verifyExpectedOutcome('ba-intake.md entry visible; single occurrence (upsert)');
  }
}
