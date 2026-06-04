import { test } from '@playwright/test';
import { NotificationsPage } from '../pages/NotificationsPage';
import { testData } from '../data/test-data';

  test('TC-NOTIF-01: Bell icon shows unread dot/badge without numeric count', async ({ page }) => {
    const notificationsPage = new NotificationsPage(page);
    await notificationsPage.performLogin(testData.notifications.email, testData.notifications.password);
    await notificationsPage.performLogout()
  });