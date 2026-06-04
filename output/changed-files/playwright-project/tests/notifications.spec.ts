import { test } from '@playwright/test';
import { NotificationsPage } from '../pages/NotificationsPage';
import { testData } from '../data/test-data';

/**
 * TurboCore — Notifications Tests
 *
 * Source: scenarios (4).md rows 1-28
 * STUB STATUS: all locators, trigger setup, routes, and assertions require QA completion.
 */

test.describe('Notifications — Bell and Overlay', () => {
  test('TC-NOTIF-01: Bell icon shows unread dot/badge without numeric count', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.goToClientHome();
    await notificationsPage.verifyUnreadDotShownWithoutNumericCount();
  });

  test('TC-NOTIF-02: Clicking bell opens floating scrollable overlay anchored near bell', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.goToClientHome();
    await notificationsPage.openNotificationOverlay();
    await notificationsPage.verifyOverlayAnchoredAndScrollable();
  });

  test('TC-NOTIF-03: Overlay lists notifications in reverse-chronological order', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.goToClientHome();
    await notificationsPage.openNotificationOverlay();
    await notificationsPage.verifyNotificationsNewestFirst();
  });

  test('TC-NOTIF-04: Notification item displays text and icon', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.goToClientHome();
    await notificationsPage.openNotificationOverlay();
    await notificationsPage.verifyNotificationCardHasTextAndIcon();
  });
});

test.describe('Notifications — Mention Triggers and Routing', () => {
  test('TC-NOTIF-05: Mention notification only triggers when mentioned user is not online in workstream', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.actorUserEmail, testData.notifications.actorUserPassword);
    await notificationsPage.triggerMentionNotification();
    await notificationsPage.verifyNoMentionNotificationWhenRecipientOnline();
  });

  test('TC-NOTIF-06: Clicking mention notification opens exact mentioned message', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.clickMentionNotification();
    await notificationsPage.verifyScrolledToMentionMessage();
  });

  test('TC-NOTIF-18: Mention scroll target takes precedence over unread divider', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.clickMentionNotification();
    await notificationsPage.verifyScrolledToMentionMessage();
  });
});

test.describe('Notifications — Assignment and Membership', () => {
  test('TC-NOTIF-07: Assignment notification includes actor and workstream name', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.actorUserEmail, testData.notifications.actorUserPassword);
    await notificationsPage.triggerAssignmentNotification();
    await notificationsPage.verifyNotificationMessageFormat('assignment notification includes actor name and workstream name');
  });

  test('TC-NOTIF-08: Assignment notification opens assignment message, not unread divider', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.clickAssignmentOrMemberNotification();
    await notificationsPage.verifyScrolledToAssignmentMessage();
  });

  test('TC-NOTIF-09: Added-as-member notification includes actor and workstream context', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.actorUserEmail, testData.notifications.actorUserPassword);
    await notificationsPage.triggerAddedAsMemberNotification();
    await notificationsPage.verifyNotificationMessageFormat('added-as-member notification includes actor and workstream context');
  });

  test('TC-NOTIF-10: Added-as-member notification opens message where user was added', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.clickAssignmentOrMemberNotification();
    await notificationsPage.verifyScrolledToAssignmentMessage();
  });

  test('TC-NOTIF-11: Workstream displays added-position marker', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.goToClientHome();
    await notificationsPage.verifyAddedPositionMarkerVisible();
  });
});

test.describe('Notifications — Status Changes', () => {
  test('TC-NOTIF-12: Status-change notification includes actor, workstream, previous status, and new status', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.actorUserEmail, testData.notifications.actorUserPassword);
    await notificationsPage.triggerStatusChangeNotification();
    await notificationsPage.verifyNotificationMessageFormat('status-change notification includes actor, workstream, previous status, and new status');
  });

  test('TC-NOTIF-13: Clicking status-change notification navigates to correct workstream context', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.openNotificationOverlay();
    await notificationsPage.verifyExpectedOutcome('status-change notification opens correct workstream context');
  });

  test('TC-NOTIF-23: Multiple status changes show correct previous and new status values', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.actorUserEmail, testData.notifications.actorUserPassword);
    await notificationsPage.triggerStatusChangeNotification();
    await notificationsPage.verifyNotificationMessageFormat('each status-change notification shows correct previous/new values');
  });
});

test.describe('Notifications — Unread Indicators', () => {
  test('TC-NOTIF-14: Workstream list shows per-user unread dot for unread messages', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyWorkstreamUnreadDotPerUser();
  });

  test('TC-NOTIF-15: Unread dot is scoped per user', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyWorkstreamUnreadDotPerUser();
  });

  test('TC-NOTIF-16: Chat displays unread divider at first unread message', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyUnreadDividerPerUser();
  });

  test('TC-NOTIF-17: Unread divider position is per-user', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyUnreadDividerPerUser();
  });
});

test.describe('Notifications — Read State, Empty State, Ordering, and Scope', () => {
  test('TC-NOTIF-19: Mark all as read clears unread badge and unread notification state', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.markAllNotificationsAsRead();
    await notificationsPage.verifyAllNotificationsRead();
  });

  test('TC-NOTIF-20: Overlay handles no-notifications empty state', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyEmptyState();
  });

  test('TC-NOTIF-21: Multiple notification types remain newest-first and keep trigger-specific formats', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.openNotificationOverlay();
    await notificationsPage.verifyNotificationsNewestFirst();
    await notificationsPage.verifyNotificationMessageFormat('each notification preserves trigger-specific message format');
  });

  test('TC-NOTIF-22: Notification displays actor who performed action', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyNotificationMessageFormat('notification displays actor, not recipient or system default');
  });

  test('TC-NOTIF-24: Notifications are in-app only when platform is closed', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyExpectedOutcome('no external/platform-closed notification is expected');
  });

  test('TC-NOTIF-25: Supported trigger delivers notification near real time', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyExpectedOutcome('notification delivery is near-real-time after supported trigger');
  });

  test('TC-NOTIF-26: Unsupported events do not create notifications', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyNoUnsupportedNotificationShown();
  });

  test('TC-NOTIF-27: Optional filter tabs preserve unread state while filtering and sorting', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.verifyOptionalTabFilters();
  });

  test('TC-NOTIF-28: Bell indicator remains dot/badge only with no numeric count', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.primaryUserEmail, testData.notifications.primaryUserPassword);
    await notificationsPage.goToClientHome();
    await notificationsPage.verifyUnreadDotShownWithoutNumericCount();
  });
});
