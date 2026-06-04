/**
 * BA-feature-specific locators for TurboCore.
 * Every value is a TODO placeholder — QA must fill in real selectors.
 * Never inline these in page objects or specs; import from here.
 *
 * Source: Feature Workflow §3 — Workstreams — BA Mode (Status: Live)
 * Surfaces: /v3/client/ba  and  /v3/client/ba/chat/{id}
 */
export const BaLocators = {
  // ─── BA Workstream List  /v3/client/ba ────────────────────────────────────
  workstreamListPage:      'TODO-locator',  // page root container
  newWorkstreamButton:     'TODO-locator',  // "New Workstream" trigger button
  workstreamListItem:      'TODO-locator',  // repeating workstream card / row
  workstreamTitleText:     'TODO-locator',  // title label inside a list item

  // ─── New Workstream Dialog ────────────────────────────────────────────────
  newWorkstreamDialog:     'TODO-locator',  // dialog/modal wrapper
  titleInput:              'TODO-locator',  // workstream name text field
  runtimeDropdown:         'TODO-locator',  // runtime selector (dev-mode only)
  submitWorkstreamButton:  'TODO-locator',  // Create / Submit button

  // ─── BA Chat Page  /v3/client/ba/chat/{id} ────────────────────────────────
  chatPage:                'TODO-locator',  // chat root container
  chatFeed:                'TODO-locator',  // scrollable message feed
  agentMessage:            'TODO-locator',  // BA agent message bubble
  userMessage:             'TODO-locator',  // user message bubble
  chatInput:               'TODO-locator',  // text input / send box
  sendButton:              'TODO-locator',  // send / submit icon-button
  attachmentPinButton:     'TODO-locator',  // attachment pin / paperclip icon
  stopButton:              'TODO-locator',  // Stop dispatch button

  // Collaboration / Members
  collaborationButton:     'TODO-locator',  // opens collaborator/member management
  collaboratorSearchInput: 'TODO-locator',  // user search field in collaborator/member dialog
  collaboratorOption:      'TODO-locator',  // matching user option in collaborator/member picker
  addCollaboratorButton:   'TODO-locator',  // confirms adding selected collaborator/member
  collaboratorListItem:    'TODO-locator',  // existing collaborator/member row
  removeCollaboratorButton: 'TODO-locator',  // remove action inside collaborator/member row
  confirmRemoveCollaboratorButton: 'TODO-locator',  // confirms member removal if a modal appears
  collaborationUpdateItem: 'TODO-locator',  // system update row in chat timeline
  collaborationUpdateIcon: 'TODO-locator',  // icon shown in user-added/user-removed collaboration update
  collaborationUpdateActorName: 'TODO-locator',  // actor name inside update row
  collaborationUpdateActionText: 'TODO-locator',  // action text inside update row
  collaborationUpdateAffectedUserName: 'TODO-locator',  // added user name inside update row

  // ─── @-Mention Autocomplete ───────────────────────────────────────────────
  mentionAutocomplete:     'TODO-locator',  // dropdown container
  mentionSuggestionItem:   'TODO-locator',  // individual suggestion row
  mentionChip:             'TODO-locator',  // rendered @-mention chip in feed

  // ─── Right-Rail Artifacts Panel ───────────────────────────────────────────
  artifactsPanel:          'TODO-locator',  // right-rail panel container
  artifactItem:            'TODO-locator',  // individual artifact entry (generic)
  baIntakeArtifactEntry:   'TODO-locator',  // the ba-intake.md entry specifically
} as const;
