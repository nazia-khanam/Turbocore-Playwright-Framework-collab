# QA Completion Checklist

- Fill all placeholders in `locators/notifications.locators.ts`.
- Confirm whether the bell icon overlay is implemented in the target environment.
- Add real multi-user test accounts to `data/test-data.ts` or environment variables.
- Replace `verifyExpectedOutcome()` placeholders with real Playwright assertions.
- Confirm routes and scroll targets for clicked notifications.
- Decide whether conditional filter-tab scenario `TC-NOTIF-27` is in scope for the current build.
