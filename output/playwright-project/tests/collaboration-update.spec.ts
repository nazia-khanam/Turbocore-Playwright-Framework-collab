import { test } from '@playwright/test';
import { QaPage } from '../pages/QaPage';
import { testData } from '../data/test-data';
import { stateStorage } from '../utils/state.storage';
import { uniqueTitle } from '../utils/helpers';

/**
 * TC_UP_NOTIF_001
 * Verify a user-added collaboration update appears in the QA workstream chat timeline.
 */
test.describe('Workstream Collaboration Updates', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC_UP_NOTIF_001: User-added collaboration update displays in chat timeline', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-collab-add');

    // Login as Maruthi (actor)
    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.createNewWorkstreamWithInvite(
      workstreamTitle,
      testData.qa.initialInviteeDisplayName,
    );
    
    // Store workstream ID for Maruthi
    // Extract workstream ID from URL or page if available
    const url = page.url();
    const urlMatch = url.match(/\/chat\/([a-zA-Z0-9-]+)/);
    if (urlMatch) {
      const workstreamId = urlMatch[1];
      stateStorage.saveWorkstreamId('maruthi', workstreamId);
    }

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.verifyCurrentChatTitle(workstreamTitle);
    await qaPage.sendMessage(testData.qa.firstMessage);
    
    // Add Umesha as collaborator and store
    await qaPage.addCollaborator(testData.qa.collaboratorDisplayName);
    stateStorage.addCollaborator('maruthi', testData.qa.collaboratorDisplayName);
    
    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.collaboratorDisplayName,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });

  test('TC_UP_NOTIF_002: User-removed collaboration update displays in chat timeline', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-collab-remove');

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.createNewWorkstreamWithInvite(
      workstreamTitle,
      testData.qa.removableMemberDisplayName,
    );

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.removeCollaborator(testData.qa.removableMemberDisplayName);
    await qaPage.verifyUserRemovedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.removableMemberDisplayName,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });

  test('TC_UP_NOTIF_003: Assignee-change collaboration update displays without actor name', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-collab-assign');

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.createNewWorkstreamWithInvite(
      workstreamTitle,
      testData.qa.initialInviteeDisplayName,
    );

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.assignUser(
      testData.qa.assigneeSearchText,
      testData.qa.assigneeDisplayName,
    );
    await qaPage.verifyWorkstreamAssignedTo(
      workstreamTitle,
      testData.qa.assigneeDisplayName,
    );
    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.verifyAssigneeChangeUpdateWithoutActor(
      testData.qa.actorDisplayName,
      testData.qa.assigneeDisplayName,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });

  test('TC_UP_NOTIF_004: Status-change activity block displays full details in chat timeline', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-status-change');

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.createNewWorkstreamWithInvite(
      workstreamTitle,
      testData.qa.initialInviteeDisplayName,
    );

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.changeWorkstreamStatus(
      testData.qa.targetStatus,
      testData.qa.statusChangeComment,
    );
    await qaPage.verifyStatusChangeActivityBlock(
      testData.qa.statusActorDisplayName,
      testData.qa.previousStatus,
      testData.qa.targetStatus,
      testData.qa.statusChangeComment,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });

  test('TC_UP_NOTIF_006: Status change comment is mandatory for empty and whitespace-only input', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-status-comment-required');

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.createNewWorkstreamWithInvite(
      workstreamTitle,
      testData.qa.initialInviteeDisplayName,
    );

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.verifyMandatoryStatusCommentValidation(
      testData.qa.targetStatus,
      testData.qa.statusChangeComment,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });

  test('TC_UP_NOTIF_009: Collaboration updates render chronologically with normal chat messages', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-collab-timeline-order');

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.createNewWorkstreamWithInvite(
      workstreamTitle,
      testData.qa.initialInviteeDisplayName,
    );

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.sendMessage(testData.qa.firstMessage);
    await qaPage.addCollaborator(testData.qa.collaboratorDisplayName);
    await qaPage.removeCollaborator(testData.qa.removableMemberDisplayName);
    await qaPage.assignUser(
      testData.qa.assigneeSearchText,
      testData.qa.assigneeDisplayName,
    );
    await qaPage.changeWorkstreamStatus(
      testData.qa.targetStatus,
      testData.qa.statusChangeComment,
    );
    await qaPage.verifyChronologicalCollaborationTimeline(
      testData.qa.actorDisplayName,
      testData.qa.collaboratorDisplayName,
      testData.qa.removableMemberDisplayName,
      testData.qa.assigneeDisplayName,
      testData.qa.previousStatus,
      testData.qa.targetStatus,
      testData.qa.statusChangeComment,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });
});
