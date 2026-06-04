import { test } from '@playwright/test';
import { BaPage } from '../pages/BaPage';
import { testData } from '../data/test-data';

/**
 * TC_UP_NOTIF_001
 * Verify a user-added collaboration update appears in the workstream chat timeline.
 */
test.describe('Workstream Collaboration Updates', () => {
  test('TC_UP_NOTIF_001: User-added collaboration update displays in chat timeline', async ({ page }) => {
    const baPage = new BaPage(page);

    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToChat(testData.ba.existingWorkstreamId);
    await baPage.addCollaborator(testData.ba.collaboratorDisplayName);
    await baPage.verifyUserAddedCollaborationUpdate(
      testData.ba.actorDisplayName,
      testData.ba.collaboratorDisplayName,
    );
  });

  test('TC_UP_NOTIF_002: User-removed collaboration update displays in chat timeline', async ({ page }) => {
    const baPage = new BaPage(page);

    await baPage.performLogin(testData.ba.userEmail, testData.ba.userPassword);
    await baPage.goToChat(testData.ba.existingWorkstreamId);
    await baPage.removeCollaborator(testData.ba.removableMemberDisplayName);
    await baPage.verifyUserRemovedCollaborationUpdate(
      testData.ba.actorDisplayName,
      testData.ba.removableMemberDisplayName,
    );
  });
});
