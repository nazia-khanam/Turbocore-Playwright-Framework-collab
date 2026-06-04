/**
 * Notifications-feature-specific locators for TurboCore.
 * Every value is a TODO placeholder — QA must fill in real selectors.
 * Never inline these in page objects or specs; import from here.
 *
 * Source: scenarios (4).md — notification scenario rows 1-28
 */
export const NotificationsLocators = {
  // ─── Bell / Indicator ─────────────────────────────────────────────────────
  notificationBell:              'button[aria-label="Notifications"][title="Notifications"]',
  unreadDotBadge:                '[title*="Unread" i], [aria-label*="Unread" i], span.bg-button-primary, [class*="badge" i]',
  numericUnreadCount:            'TODO-locator',

  // ─── Overlay ──────────────────────────────────────────────────────────────
  notificationOverlay:           'TODO-locator',
  overlayScrollRegion:           'TODO-locator',
  notificationCard:              'TODO-locator',
  notificationText:              'TODO-locator',
  notificationIcon:              'TODO-locator',
  notificationTimestamp:         'TODO-locator',
  unreadNotificationState:       'TODO-locator',
  emptyState:                    'TODO-locator',
  markAllAsReadButton:           'TODO-locator',

  // ─── Optional Filters ─────────────────────────────────────────────────────
  allTab:                        'TODO-locator',
  mentionsTab:                   '"button", { name: /Mentions \(\d+\)/i }',
  assignedTab:                   '"button", { name: /Assigned \(\d+\)/i }',
  readTab:                       'TODO-locator',

  // ─── Workstream / Chat Unread State ───────────────────────────────────────
  workstreamListItem:            'TODO-locator',
  workstreamUnreadDot:           'TODO-locator',
  chatMessage:                   'TODO-locator',
  unreadMessageDivider:          'TODO-locator',
  addedPositionMarker:           'TODO-locator',
  targetMentionMessage:          'TODO-locator',
  targetAssignmentMessage:       'TODO-locator',

  // ─── Trigger Setup Controls ───────────────────────────────────────────────
  chatInput:                     'TODO-locator',
  sendButton:                    'TODO-locator',
  mentionAutocomplete:           'TODO-locator',
  mentionSuggestionItem:         'TODO-locator',
  shareOrAssignButton:           'TODO-locator',
  assignUserControl:             'TODO-locator',
  addMemberControl:              'TODO-locator',
  statusDropdown:                'TODO-locator',
  statusOption:                  'TODO-locator',

  // ─── Unsupported / Negative Event Controls ────────────────────────────────
  genericCommentControl:         'TODO-locator',
  dueDateReminderControl:        'TODO-locator',
  systemAnnouncementControl:     'TODO-locator',
} as const;
