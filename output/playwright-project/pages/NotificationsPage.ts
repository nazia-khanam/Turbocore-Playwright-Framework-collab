import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { NotificationsLocators } from '../locators/notifications.locators';

/**
 * Page object for TurboCore notifications.
 *
 * STUB STATUS: all locators are TODO placeholders. QA must complete
 * locators/notifications.locators.ts before any test can run.
 */
export class NotificationsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goToClientHome(): Promise<void> {
    await this.navigateTo('/v3/client');
    // TODO: wait for dashboard/client shell to render.
  }

  async openNotificationOverlay(): Promise<void> {
    await this.page.locator(NotificationsLocators.notificationBell).click();
    await this.page.locator(NotificationsLocators.notificationOverlay).waitFor({ state: 'visible' });
  }

  async verifyUnreadDotShownWithoutNumericCount(): Promise<void> {
    // TODO: assert unread dot/badge is visible.
    // TODO: assert no numeric unread count is displayed on the bell indicator.
    await this.verifyExpectedOutcome('bell shows unread dot/badge without numeric count');
  }

  async verifyOverlayAnchoredAndScrollable(): Promise<void> {
    // TODO: assert overlay position is anchored near bottom-left bell.
    // TODO: assert overlay scroll region is available when content overflows.
    await this.verifyExpectedOutcome('floating scrollable overlay opens anchored near bell');
  }

  async verifyNotificationsNewestFirst(): Promise<void> {
    // TODO: collect timestamps/order from notification cards and assert reverse chronological order.
    await this.verifyExpectedOutcome('notifications are ordered newest first');
  }

  async verifyNotificationCardHasTextAndIcon(): Promise<void> {
    // TODO: assert each card contains notification text and category icon.
    await this.verifyExpectedOutcome('notification item displays text and icon');
  }

  async triggerMentionNotification(): Promise<void> {
    // TODO: log in as actor user or use prepared actor session.
    // TODO: open a workstream where recipient is not online.
    // TODO: type @mention and send message.
    await this.verifyExpectedOutcome('mention notification trigger executed');
  }

  async verifyNoMentionNotificationWhenRecipientOnline(): Promise<void> {
    // TODO: prepare recipient online in same workstream.
    // TODO: send mention and assert no notification is created.
    await this.verifyExpectedOutcome('no mention notification when recipient is online in workstream');
  }

  async clickMentionNotification(): Promise<void> {
    await this.openNotificationOverlay();
    await this.page.locator(NotificationsLocators.notificationCard).first().click();
    // TODO: wait for related workstream and target message anchor.
  }

  async verifyScrolledToMentionMessage(): Promise<void> {
    // TODO: assert target mention message is visible and takes precedence over unread divider.
    await this.verifyExpectedOutcome('mention notification opens exact mentioned message');
  }

  async triggerAssignmentNotification(): Promise<void> {
    // TODO: assign workstream to logged-in user with actor account.
    await this.verifyExpectedOutcome('assignment notification trigger executed');
  }

  async triggerAddedAsMemberNotification(): Promise<void> {
    // TODO: add logged-in user as workstream member with actor account.
    await this.verifyExpectedOutcome('added-as-member notification trigger executed');
  }

  async triggerStatusChangeNotification(): Promise<void> {
    // TODO: change workstream status from previous value to new value.
    await this.verifyExpectedOutcome('status-change notification trigger executed');
  }

  async verifyNotificationMessageFormat(expectedFormatDescription: string): Promise<void> {
    // TODO: assert actor, workstream, and trigger-specific text fragments.
    await this.verifyExpectedOutcome(expectedFormatDescription);
  }

  async clickAssignmentOrMemberNotification(): Promise<void> {
    await this.openNotificationOverlay();
    await this.page.locator(NotificationsLocators.notificationCard).first().click();
    // TODO: wait for workstream context and target assignment/add-member message.
  }

  async verifyScrolledToAssignmentMessage(): Promise<void> {
    // TODO: assert scroll target is assignment/member message, not unread divider.
    await this.verifyExpectedOutcome('notification opens assignment/member message target');
  }

  async verifyAddedPositionMarkerVisible(): Promise<void> {
    await this.page.locator(NotificationsLocators.addedPositionMarker).waitFor({ state: 'visible' });
    await this.verifyExpectedOutcome('added-position marker displayed in workstream');
  }

  async verifyWorkstreamUnreadDotPerUser(): Promise<void> {
    // TODO: compare unread dot visibility across prepared user sessions.
    await this.verifyExpectedOutcome('workstream unread dot is scoped per user');
  }

  async verifyUnreadDividerPerUser(): Promise<void> {
    // TODO: compare divider position across users with different read states.
    await this.verifyExpectedOutcome('unread message divider position is scoped per user');
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.openNotificationOverlay();
    await this.page.locator(NotificationsLocators.markAllAsReadButton).click();
    // TODO: wait for unread state to clear.
  }

  async verifyAllNotificationsRead(): Promise<void> {
    // TODO: assert bell unread dot clears and cards are no longer unread.
    await this.verifyExpectedOutcome('all notifications are marked read and bell indicator clears');
  }

  async verifyEmptyState(): Promise<void> {
    await this.openNotificationOverlay();
    await this.page.locator(NotificationsLocators.emptyState).waitFor({ state: 'visible' });
    await this.verifyExpectedOutcome('empty state displays without stale unread count');
  }

  async verifyNoUnsupportedNotificationShown(): Promise<void> {
    // TODO: attempt unsupported triggers and assert notification list does not include them.
    await this.verifyExpectedOutcome('unsupported events do not create notifications');
  }

  async verifyOptionalTabFilters(): Promise<void> {
    // TODO: only enable if final design includes tabs.
    await this.verifyExpectedOutcome('notification tabs filter/sort without losing unread state');
  }
}
