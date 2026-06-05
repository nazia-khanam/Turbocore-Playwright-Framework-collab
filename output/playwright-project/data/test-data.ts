/// <reference types="node" />
import { uniqueTitle } from '../utils/helpers';

/**
 * Central test-data registry for TurboCore Playwright tests.
 *
 * Replace ALL TODO values before running.
 * Load sensitive values (email, password) from .env — never commit real credentials.
 * Use utils/helpers.ts uniqueTitle() for titles to avoid test-run collisions.
 */
export const testData = {

  /** Shared auth credentials — injected from .env */
  auth: {
    userEmail:    process.env.TEST_USER_EMAIL    || 'TODO-user@example.com',
    userPassword: process.env.TEST_USER_PASSWORD || 'TODO-password',
  },

  /** BA feature test data */
  ba: {
    userEmail:    process.env.TEST_USER_EMAIL    || 'TODO-user@example.com',
    userPassword: process.env.TEST_USER_PASSWORD || 'TODO-password',

    // Workstream creation
    newWorkstreamTitle: uniqueTitle('BA-collab'),
    // TIP: use uniqueTitle('BA-smoke') from utils/helpers.ts to avoid collisions

    // Chat messages
    firstMessage:      'Hello team, please review this collaborator update.',
    followUpMessages: [
      'Please add the final requirements here.',
      'Can the BA agent summarize the current intake?',
    ],

    // @-mention: partial name of a real same-tenant staging user
    mentionPartialName: 'TODO-teammate-partial-name',

    // Collaboration/member update
    existingWorkstreamId: process.env.BA_EXISTING_WORKSTREAM_ID || 'TODO-workstream-id',
    actorDisplayName: process.env.BA_ACTOR_DISPLAY_NAME || 'Maruthi',
    collaboratorDisplayName: process.env.BA_COLLABORATOR_DISPLAY_NAME || 'Umesha',
    removableMemberDisplayName: process.env.BA_REMOVABLE_MEMBER_DISPLAY_NAME || 'TODO-removable-member-display-name',
  },

  /** Notifications feature test data */
  notifications: {
    primaryUserEmail:    process.env.TEST_USER_EMAIL    || 'TODO-primary-user@example.com',
    primaryUserPassword: process.env.TEST_USER_PASSWORD || 'TODO-password',
    actorUserEmail:      process.env.NOTIFICATION_ACTOR_EMAIL    || 'TODO-actor-user@example.com',
    actorUserPassword:   process.env.NOTIFICATION_ACTOR_PASSWORD || 'TODO-password',
    secondaryUserEmail:  process.env.NOTIFICATION_SECONDARY_EMAIL || 'TODO-secondary-user@example.com',
    secondaryUserPassword: process.env.NOTIFICATION_SECONDARY_PASSWORD || 'TODO-password',

    workstreamId:        'TODO-workstream-id',
    workstreamName:      'TODO-workstream-name',
    mentionPartialName:  'TODO-mentioned-user-partial-name',
    previousStatus:      'TODO-previous-status',
    newStatus:           'TODO-new-status',
    nearRealTimeThresholdMs: 5000,
    email: process.env.TEST_USER_EMAIL || 'TODO-user@example.com',
    password: process.env.TEST_USER_PASSWORD || 'TODO-password',
  },

  /** QA feature test data */
  qa: {
    userEmail:    process.env.QA_USER_EMAIL    || process.env.TEST_USER_EMAIL    || 'TODO-qa-user@example.com',
    userPassword: process.env.QA_USER_PASSWORD || process.env.TEST_USER_PASSWORD || 'TODO-password',

    // Workstream creation
    newWorkstreamTitle: uniqueTitle('QA-collab'),

    // Existing workstream for testing
    existingWorkstreamId: process.env.QA_EXISTING_WORKSTREAM_ID || 'TODO-qa-workstream-id',

    // Chat messages
    firstMessage: 'Hello QA team, please review this collaborator update.',

    // Collaboration/member update
    actorDisplayName: process.env.QA_ACTOR_DISPLAY_NAME || 'maruthiprasad.pc',
    initialInviteeDisplayName: process.env.QA_INITIAL_INVITEE_DISPLAY_NAME || 'nazia.khanam',
    collaboratorDisplayName: process.env.QA_COLLABORATOR_DISPLAY_NAME || 'umesha.kn',
    removableMemberDisplayName: process.env.QA_REMOVABLE_MEMBER_DISPLAY_NAME || 'nazia.khanam',
    assigneeSearchText: process.env.QA_ASSIGNEE_SEARCH_TEXT || 'umesha.kn',
    assigneeDisplayName: process.env.QA_ASSIGNEE_DISPLAY_NAME || 'umesha.kn',
    statusActorDisplayName: process.env.QA_STATUS_ACTOR_DISPLAY_NAME || 'maruthiprasad.pc',
    previousStatus: process.env.QA_PREVIOUS_STATUS || 'Drafting',
    targetStatus: process.env.QA_TARGET_STATUS || 'In Review',
    statusChangeComment: process.env.QA_STATUS_CHANGE_COMMENT || 'Moving this QA workstream to review.',
  },

} as const;
