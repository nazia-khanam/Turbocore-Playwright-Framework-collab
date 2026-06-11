import { expect, Page, test } from '@playwright/test';
import { QaPage } from '../pages/QaPage';
import { testData } from '../data/test-data';

const workstreamTitle = 'Collaboration-update-features';

async function loginAndOpenWorkstream(page: Page): Promise<QaPage> {
  const qaPage = new QaPage(page);

  await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
  await qaPage.goToQaList();
  await qaPage.openChatFromList(workstreamTitle);

  return qaPage;
}

async function loginAndOpenQaList(page: Page): Promise<QaPage> {
  const qaPage = new QaPage(page);

  await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
  await qaPage.goToQaList();

  return qaPage;
}

/**
 * TC_UP_NOTIF_001
 * Verify a user-added collaboration update appears in the QA workstream chat timeline.
 */
test.describe('Workstream Collaboration Updates', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC_UP_NOTIF_002: User-removed collaboration update displays in chat timeline', async ({ page }) => {
    const qaPage = await loginAndOpenQaList(page);
    const assigneeTarget = await qaPage.getNextAssigneeTarget(workstreamTitle);
    await qaPage.openChatFromList(workstreamTitle);

    await qaPage.addCollaboratorIfMissing(testData.qa.removableMemberDisplayName);
    await qaPage.addCollaboratorIfMissing(testData.qa.assigneeDisplayName);
    await qaPage.assignUser(assigneeTarget.searchText, assigneeTarget.displayName);

    await qaPage.removeCollaboratorIfPresent(testData.qa.removableMemberDisplayName);
    await qaPage.verifyUserRemovedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.removableMemberDisplayName,
    );

    await qaPage.removeCollaboratorIfPresent(testData.qa.assigneeDisplayName);
    await qaPage.verifyUserRemovedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.assigneeDisplayName,
    );
  });

  test('TC_UP_NOTIF_001: User-added collaboration update displays in chat timeline', async ({ page }) => {
    const qaPage = await loginAndOpenWorkstream(page);

    await qaPage.verifyCurrentChatTitle(workstreamTitle);
    await qaPage.sendMessage(testData.qa.firstMessage);

    await qaPage.removeCollaboratorIfPresent(testData.qa.collaboratorDisplayName);
    await qaPage.addCollaborator(testData.qa.collaboratorDisplayName);

    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.collaboratorDisplayName,
    );
  });

  test('TC_UP_NOTIF_003: Assignee-change collaboration update displays without actor name', async ({ page }) => {
    const qaPage = await loginAndOpenQaList(page);
    const assigneeTarget = await qaPage.getNextAssigneeTarget(workstreamTitle);

    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.removeCollaboratorIfPresent(assigneeTarget.displayName);
    await qaPage.assignUser(
      assigneeTarget.searchText,
      assigneeTarget.displayName,
    );
    await qaPage.verifyWorkstreamAssignedTo(
      workstreamTitle,
      assigneeTarget.displayName,
    );
    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.verifyAssigneeChangeUpdateWithoutActor(
      testData.qa.actorDisplayName,
      assigneeTarget.displayName,
    );
  });

  test('TC_UP_NOTIF_004: Status-change activity block displays full details in chat timeline', async ({ page }) => {
    const qaPage = await loginAndOpenWorkstream(page);
    const statusChange = await qaPage.ensureChangeStatus(workstreamTitle);

    await qaPage.verifyStatusChangeActivityBlock(
      testData.qa.statusActorDisplayName,
      statusChange.previousStatus,
      statusChange.nextStatus,
      statusChange.comment,
    );
  });

  test('TC_UP_NOTIF_006: Status change comment is mandatory for empty and whitespace-only input', async ({ page }) => {
    const qaPage = await loginAndOpenQaList(page);
    const currentStatus = (await qaPage.getWorkstreamStatus(workstreamTitle)) || testData.qa.previousStatus;

    await qaPage.openChatFromList(workstreamTitle);
    const nextStatus = qaPage.getNextStatus(currentStatus);

    await qaPage.verifyMandatoryStatusCommentValidation(
      nextStatus,
      qaPage.getStatusChangeComment(nextStatus),
    );
  });

  test('TC_UP_NOTIF_009: Collaboration updates render chronologically with normal chat messages', async ({ page }) => {
    const qaPage = await loginAndOpenQaList(page);
    const timelineCollaborator = testData.qa.removableMemberDisplayName;

    const assigneeTarget = await qaPage.getNextAssigneeTarget(workstreamTitle);
    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.sendMessage(testData.qa.firstMessage);
    await qaPage.removeCollaboratorIfPresent(timelineCollaborator);
    await qaPage.addCollaborator(timelineCollaborator);
    await qaPage.removeCollaboratorIfPresent(timelineCollaborator);
    await qaPage.assignUser(
      assigneeTarget.searchText,
      assigneeTarget.displayName,
    );
    const statusChange = await qaPage.ensureChangeStatus(workstreamTitle);
    await qaPage.verifyChronologicalCollaborationTimeline(
      testData.qa.actorDisplayName,
      timelineCollaborator,
      timelineCollaborator,
      assigneeTarget.displayName,
      statusChange.previousStatus,
      statusChange.nextStatus,
      statusChange.comment,
    );
  });

  test('TC_UP_NOTIF_011: Collaboration update appears immediately in messages section without page refresh', async ({ page }) => {
    const qaPage = await loginAndOpenWorkstream(page);
    const realtimeCollaborator = testData.qa.removableMemberDisplayName;

    const currentUrl = page.url();

    await qaPage.removeCollaboratorIfPresent(realtimeCollaborator);
    await qaPage.addCollaborator(realtimeCollaborator);
    await expect(page).toHaveURL(currentUrl, { timeout: 10000 });

    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      realtimeCollaborator,
    );
  });

  test('TC_UP_NOTIF_012: Collaboration updates remain visible after reload, refresh, logout/login, and returning to the same workstream', async ({ page }) => {
    const qaPage = await loginAndOpenWorkstream(page);
    const persistentCollaborator = testData.qa.removableMemberDisplayName;

    const chatUrl = page.url();
    const urlMatch = chatUrl.match(/\/chat\/([a-zA-Z0-9-]+)/);
    const workstreamId = urlMatch ? urlMatch[1] : undefined;

    await qaPage.removeCollaboratorIfPresent(persistentCollaborator);
    await qaPage.addCollaborator(persistentCollaborator);
    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      persistentCollaborator,
    );

    await page.reload({ waitUntil: 'networkidle' });
    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      persistentCollaborator,
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
      persistentCollaborator,
    );
  });

  test('TC_UP_NOTIF_016: Status-change comments preserve long multiline text, special characters, and safe rendering', async ({ page }) => {
    const qaPage = await loginAndOpenWorkstream(page);
    const uniqueSuffix = `\nUniqueCommentID:${Date.now()}`;
    const longComment = `This status comment contains long text, special characters, and multiline formatting:
- verify literal HTML tags: <script>alert("xss")</script>
- verify bold-like text: <b>should not render as HTML</b>
- verify special characters: !@#$%^&*()_+{}|:"<>?[];'./,\n- verify line breaks and tabs:\n\tline two\n\tline three
Ensure the full comment remains visible, untruncated, and safely rendered.${uniqueSuffix}`;

    await qaPage.ensureChangeStatus(workstreamTitle, longComment);
    await qaPage.verifyStatusCommentRenderingRobustness(
      testData.qa.actorDisplayName,
      longComment,
    );
  });

  test('TC_UP_NOTIF_020: Status-change activity block shows the correct status-change date/time', async ({ page }) => {
    const qaPage = await loginAndOpenWorkstream(page);
    const actionDate = new Date();

    const statusChange = await qaPage.ensureChangeStatus(workstreamTitle);

    await qaPage.verifyStatusChangeDateTime(
      testData.qa.actorDisplayName,
      statusChange.previousStatus,
      statusChange.nextStatus,
      actionDate,
      statusChange.comment,
    );
  });
});
