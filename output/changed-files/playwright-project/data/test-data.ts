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
    newWorkstreamTitle: 'TODO-test-workstream-title',
    // TIP: use uniqueTitle('BA-smoke') from utils/helpers.ts to avoid collisions

    // Chat messages
    firstMessage:      'TODO-first-message-to-ba-agent',
    followUpMessages: [
      'TODO-follow-up-message-1',
      'TODO-follow-up-message-2',
    ],

    // @-mention: partial name of a real same-tenant staging user
    mentionPartialName: 'TODO-teammate-partial-name',
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
  },

} as const;
