import { expect, test } from '@playwright/test';
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

  test('TC_UP_NOTIF_011: Collaboration update appears immediately in messages section without page refresh', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-collab-real-time');

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
    const currentUrl = page.url();

    await qaPage.addCollaborator(testData.qa.collaboratorDisplayName);
    await expect(page).toHaveURL(currentUrl, { timeout: 10000 });

    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.collaboratorDisplayName,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });

  test('TC_UP_NOTIF_012: Collaboration updates remain visible after reload, refresh, logout/login, and returning to the same workstream', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-collab-persistence');

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
    const chatUrl = page.url();
    const urlMatch = chatUrl.match(/\/chat\/([a-zA-Z0-9-]+)/);
    const workstreamId = urlMatch ? urlMatch[1] : undefined;

    await qaPage.addCollaborator(testData.qa.collaboratorDisplayName);
    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.collaboratorDisplayName,
    );

    await page.reload({ waitUntil: 'networkidle' });
    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.collaboratorDisplayName,
    );

    await qaPage.performLogout();
    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);

    if (workstreamId) {
      await qaPage.goToChat(workstreamId);
    } else {
      await qaPage.openChatFromList(workstreamTitle);
    }

    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.collaboratorDisplayName,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });
  test('TC_UP_NOTIF_016: Status-change comments preserve long multiline text, special characters, and safe rendering', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-status-comment-robustness');
    const longComment = `This status comment contains long text, special characters, and multiline formatting:
- verify literal HTML tags: <script>alert("xss")</script>
- verify bold-like text: <b>should not render as HTML</b>
- verify special characters: !@#$%^&*()_+{}|:"<>?[];'./,\n- verify line breaks and tabs:\n\tline two\n\tline three
Ensure the full comment remains visible, untruncated, and safely rendered.`;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.createNewWorkstream(workstreamTitle);

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.changeWorkstreamStatus(
      testData.qa.targetStatus,
      longComment,
    );

    await qaPage.verifyStatusCommentRenderingRobustness(
      testData.qa.actorDisplayName,
      testData.qa.previousStatus,
      testData.qa.targetStatus,
      longComment,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });

  test('TC_UP_NOTIF_020: Status-change activity block shows the correct status-change date/time', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = uniqueTitle('QA-status-date-time');
    const actionDate = new Date();

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.createNewWorkstream(workstreamTitle);

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.changeWorkstreamStatus(
      testData.qa.targetStatus,
      testData.qa.statusChangeComment,
    );

    await qaPage.verifyStatusChangeDateTime(
      testData.qa.actorDisplayName,
      testData.qa.previousStatus,
      testData.qa.targetStatus,
      actionDate,
    );
    await qaPage.deleteCurrentChat(workstreamTitle);
  });

});
