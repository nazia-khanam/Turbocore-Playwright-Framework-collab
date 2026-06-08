import { expect, test } from '@playwright/test';
import { QaPage } from '../pages/QaPage';
import { testData } from '../data/test-data';
import { stateStorage } from '../utils/state.storage';

const featureWorkstreamTitle = 'Collaboration-update-features';

const statusSequence = [
  'Drafting',
  'In Review',
  'Committed',
  'In Execution',
  'Completed',
  'Archived',
];

type StatusChange = {
  previousStatus: string;
  nextStatus: string;
  comment: string;
};

type AssigneeTarget = {
  searchText: string;
  displayName: string;
};

function getNextStatus(current: string): string {
  const idx = statusSequence.findIndex(s => new RegExp(`^${s}$`, 'i').test(current));

  if (idx === -1 || /archived/i.test(current)) {
    return statusSequence[0];
  }

  return statusSequence[(idx + 1) % statusSequence.length];
}

function statusChangeCommentFor(status: string): string {
  return `Moving this QA workstream to ${status}.`;
}

async function ensureChangeStatus(qaPage: QaPage, title: string, comment?: string): Promise<StatusChange> {
  const current = (await qaPage.getWorkstreamStatus(title)) || '';
  const next = getNextStatus(current);
  const statusComment = comment ?? statusChangeCommentFor(next);

  await qaPage.openChatFromList(title);
  await qaPage.changeWorkstreamStatus(next, statusComment);
  return {
    previousStatus: current,
    nextStatus: next,
    comment: statusComment,
  };
}

async function getNextAssigneeTarget(qaPage: QaPage, title: string): Promise<AssigneeTarget> {
  const currentAssignee = (await qaPage.getWorkstreamAssignee(title)) || '';
  const candidates: AssigneeTarget[] = [
    {
      searchText: testData.qa.assigneeSearchText,
      displayName: testData.qa.assigneeDisplayName,
    },
    {
      searchText: testData.qa.removableMemberDisplayName,
      displayName: testData.qa.removableMemberDisplayName,
    },
  ];

  const currentIndex = candidates.findIndex(candidate => (
    new RegExp(`^${candidate.displayName}$`, 'i').test(currentAssignee)
  ));

  if (currentIndex === -1) {
    return candidates[0];
  }

  return candidates[(currentIndex + 1) % candidates.length];
}

/**
 * TC_UP_NOTIF_001
 * Verify a user-added collaboration update appears in the QA workstream chat timeline.
 */
test.describe('Workstream Collaboration Updates', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const qaPage = new QaPage(page);

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    const exists = await qaPage.openExistingWorkstream(featureWorkstreamTitle);
    expect(
      exists,
      `Permanent workstream "${featureWorkstreamTitle}" must already exist. This suite does not create replacement workstreams.`,
    ).toBe(true);

    await context.close();
  });

  test('TC_UP_NOTIF_002: User-removed collaboration update displays in chat timeline', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    const assigneeTarget = await getNextAssigneeTarget(qaPage, workstreamTitle);
    await qaPage.openChatFromList(workstreamTitle);
    
    // Remove both nazia.khanam and umesha.kn from the permanent shared workstream first.
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
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.verifyCurrentChatTitle(workstreamTitle);
    await qaPage.sendMessage(testData.qa.firstMessage);

    // Add Umesha back to the same permanent shared workstream.
    await qaPage.removeCollaboratorIfPresent(testData.qa.collaboratorDisplayName);
    await qaPage.addCollaborator(testData.qa.collaboratorDisplayName);
    stateStorage.addCollaborator('maruthi', testData.qa.collaboratorDisplayName);

    await qaPage.verifyUserAddedCollaborationUpdate(
      testData.qa.actorDisplayName,
      testData.qa.collaboratorDisplayName,
    );
  });

  test('TC_UP_NOTIF_003: Assignee-change collaboration update displays without actor name', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    const assigneeTarget = await getNextAssigneeTarget(qaPage, workstreamTitle);
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
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.openChatFromList(workstreamTitle);
    const statusChange = await ensureChangeStatus(qaPage, workstreamTitle);
    await qaPage.verifyStatusChangeActivityBlock(
      testData.qa.statusActorDisplayName,
      statusChange.previousStatus,
      statusChange.nextStatus,
      statusChange.comment,
    );
  });

  test('TC_UP_NOTIF_006: Status change comment is mandatory for empty and whitespace-only input', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    const currentStatus = (await qaPage.getWorkstreamStatus(workstreamTitle)) || testData.qa.previousStatus;
    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.verifyMandatoryStatusCommentValidation(
      getNextStatus(currentStatus),
      statusChangeCommentFor(getNextStatus(currentStatus)),
    );
  });

  test('TC_UP_NOTIF_009: Collaboration updates render chronologically with normal chat messages', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;
    const timelineCollaborator = testData.qa.removableMemberDisplayName;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    const assigneeTarget = await getNextAssigneeTarget(qaPage, workstreamTitle);
    await qaPage.openChatFromList(workstreamTitle);
    await qaPage.sendMessage(testData.qa.firstMessage);
    await qaPage.removeCollaboratorIfPresent(timelineCollaborator);
    await qaPage.addCollaborator(timelineCollaborator);
    await qaPage.removeCollaboratorIfPresent(timelineCollaborator);
    await qaPage.assignUser(
      assigneeTarget.searchText,
      assigneeTarget.displayName,
    );
    const statusChange = await ensureChangeStatus(qaPage, workstreamTitle);
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
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;
    const realtimeCollaborator = testData.qa.removableMemberDisplayName;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.openChatFromList(workstreamTitle);
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
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;
    const persistentCollaborator = testData.qa.removableMemberDisplayName;

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.openChatFromList(workstreamTitle);
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
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;
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
    await qaPage.openChatFromList(workstreamTitle);
    const statusChange = await ensureChangeStatus(qaPage, workstreamTitle, longComment);

    await qaPage.verifyStatusCommentRenderingRobustness(
      testData.qa.actorDisplayName,
      statusChange.previousStatus,
      statusChange.nextStatus,
      longComment,
    );
  });

  test('TC_UP_NOTIF_020: Status-change activity block shows the correct status-change date/time', async ({ page }) => {
    const qaPage = new QaPage(page);
    const workstreamTitle = featureWorkstreamTitle;
    const actionDate = new Date();

    await qaPage.performLogin(testData.qa.userEmail, testData.qa.userPassword);
    stateStorage.saveUserSession('maruthi', {
      email: testData.qa.userEmail,
      password: testData.qa.userPassword,
    });

    await qaPage.goToQaList();
    await qaPage.openChatFromList(workstreamTitle);
    const statusChange = await ensureChangeStatus(qaPage, workstreamTitle);

    await qaPage.verifyStatusChangeDateTime(
      testData.qa.actorDisplayName,
      statusChange.previousStatus,
      statusChange.nextStatus,
      actionDate,
    );
  });

});
