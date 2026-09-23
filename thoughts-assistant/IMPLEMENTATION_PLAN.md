# Thoughts Assistant — Implementation Plan and Guardrails

Last established baseline: 2026-09-23
Repository: itamarlev/website
Path: thoughts-assistant/
Primary target: https://itamarlev.com/thoughts-assistant/
Legacy/alternate target: https://thoughts-into-action.itamarlev.chatgpt.site

## Purpose
This file is the persistent source of truth for staged work on Thoughts Assistant.
Before each implementation step, re-read this file and the current repository files.
Do not assume a previous change was deployed or verified unless it was explicitly checked.

## Non-negotiable product requirements
The GitHub version must preserve:
- Add thoughts/tasks
- Friends/people
- Reminders
- Recurring reminders
- Random reminders
- Edit thought
- Delete thought
- Edit friend
- Delete friend
- Change reminder frequency for a friend
- Archive and restore
- Hebrew and English
- Strong iPhone/mobile usability
- Voice input when technically supported
- A usable list when multiple reminders are due together

Friends are a first-class feature and must never be removed.

## Data safety
Historical storage keys include:
- thoughts_app_v2
- thoughts_assistant_v1

Rules:
1. Never delete an existing storage key as part of a migration.
2. Never overwrite existing user data with a smaller/newer dataset.
3. Migrations must be idempotent.
4. Merge before replacing.
5. Create a user-visible export/backup option before any schema migration.
6. localStorage is origin-scoped. chatgpt.site data cannot be read by itamarlev.com directly.
7. Cross-origin migration requires explicit export/import or code running on the source origin.
8. Every migration must preserve unknown fields where possible.

## Known baseline facts
- The current GitHub directory contains index.html, app.js, and app.css.
- index.html currently contains its own CSS and JavaScript and does not load app.js/app.css.
- Therefore index.html is currently the effective implementation in the repository.
- app.js/app.css contain code from another implementation and must not be treated as live without wiring them in.
- Repository has push/admin access through the GitHub connector.
- Repository is not using GitHub Pages.
- README documents Cloudflare Pages deployment with an empty build command and output directory '/'.
- A GitHub commit is NOT proof of a successful Cloudflare production deployment.
- The ChatGPT site could not be inspected or verified from available browsing tools at the baseline audit.
- Do not claim the ChatGPT site was edited, published, or tested unless that is later verified directly.

## Known functional gaps in current index.html
- Browser notifications only work while the page is active/open enough for JavaScript to run.
- No verified Notification.requestPermission onboarding.
- No service worker / web push / background notification system.
- Random reminder logic can immediately advance nextAt and stop showing the current reminder as due.
- Random reminders are not constrained to a preferred daytime window.
- Voice input relies on SpeechRecognition/webkitSpeechRecognition only.
- Migration skips legacy keys when thoughts_app_v2 already exists, so it does not safely merge both datasets.
- Hash-based transfer is not a complete long-term migration solution.
- Duplicate implementations in index.html vs app.js/app.css create maintenance risk.

## Execution order

### Phase 0 — Re-establish baseline before every major phase
- Fetch current thoughts-assistant directory.
- Fetch current index.html, app.js, app.css.
- Check latest commits touching thoughts-assistant/.
- Compare current HEAD with the commit recorded in the previous checkpoint.
- If files changed outside this workflow, stop assuming prior code state and re-audit the affected areas.

### Phase 1 — Establish one source of truth
Goal: remove implementation ambiguity without changing product behavior.
- Choose a single structure.
- Preferred target: index.html loads app.css and app.js.
- Port any currently-live inline functionality into app.js/app.css first.
- Do not delete legacy files until behavior parity is verified.
- Keep a temporary rollback path.

Acceptance:
- Same visible features as baseline.
- No storage migration yet.
- No user data change.
- No removed feature.

### Phase 2 — Data safety and migration foundation
Goal: make future changes safe.
- Add structured load/normalize/merge logic.
- Merge thoughts_app_v2 and thoughts_assistant_v1 rather than short-circuiting.
- De-duplicate conservatively.
- Preserve original keys.
- Add Export Backup.
- Add Import with preview/confirmation.
- Add schemaVersion in newly saved data without breaking old data.

Acceptance:
- Existing data remains intact.
- Re-running migration produces no duplicates.
- Both known keys can contribute data.
- Export can round-trip into a clean browser profile.

### Phase 3 — Core behavior correctness
Goal: make reminders reliable inside the web app.
- Separate "due occurrence" from "next scheduled occurrence".
- A reminder remains visible until user acts on it.
- Recurring completion advances correctly.
- Random reminders create an occurrence, then schedule the next one only after acknowledgment/completion.
- Constrain random reminders to a configurable daytime window, default 09:00–21:00 unless product decision changes it.
- Ensure multiple simultaneous reminders are easy to process.

Acceptance:
- No due reminder disappears merely because render/maybeNotify ran.
- Repeating reminders survive completion correctly.
- Random reminders never schedule outside the allowed window.
- Multiple due items are independently actionable.

### Phase 4 — Friends as a first-class workflow
Goal: optimize the feature the user actively relies on.
- Keep friend type.
- Make edit/delete/frequency actions obvious.
- Allow frequency changes without re-entering unrelated data.
- Consider a dedicated Friends view only if it improves usability without complicating the core app.
- Preserve all friend data during migrations.

Acceptance:
- Add friend.
- Edit friend.
- Delete friend.
- Archive/restore friend.
- Change fixed or random reminder frequency.
- Existing friend records remain intact.

### Phase 5 — iPhone and voice
Goal: strong mobile experience.
- Test layout for common iPhone widths and safe areas.
- Ensure buttons meet touch-target expectations.
- Avoid modal overflow with the on-screen keyboard.
- Preserve RTL usability.
- Use SpeechRecognition where supported.
- Provide a graceful fallback if unsupported.
- If audio recording is retained as fallback, store blobs in IndexedDB and keep metadata references safe.

Acceptance:
- Core flows require no horizontal scrolling.
- Editing/scheduling remains usable with keyboard open.
- Unsupported speech does not break adding thoughts.

### Phase 6 — Notifications
Goal: define and implement the strongest technically realistic notification model.
- First add explicit browser notification permission onboarding.
- Separate in-app due state from system notification delivery.
- Evaluate installable PWA + service worker + Web Push for iPhone.
- If push requires backend/Cloudflare work, document exact architecture before implementation.
- Never claim background reminders work until tested with the app closed.

Acceptance:
- User understands whether notifications are in-app only or background-capable.
- Permission state is visible.
- Background delivery is verified on a real supported path before calling it complete.

### Phase 7 — ChatGPT-site migration path
Goal: safely move historical data to the GitHub version.
- Do not assume access to chatgpt.site source.
- If source can be edited, add explicit Export to file/text or one-time transfer flow.
- If source cannot be edited, provide user-run DevTools/bookmarklet/manual export only if needed and safe.
- Never attempt to read source-origin localStorage remotely.

Acceptance:
- Transfer is explicit.
- Destination merges rather than overwrites.
- Backup exists first.
- Counts before/after are shown to the user.

### Phase 8 — UX refinement
Goal: make GitHub version the preferred version.
- Only after behavior/data stability.
- Mobile-first visual hierarchy.
- Fast capture first.
- Due reminders second.
- Friends easy to reach.
- Archive and secondary tools remain accessible but not dominant.
- Avoid redesigns that hide functionality.

### Phase 9 — Deployment verification
For every production change:
1. Record pre-change HEAD.
2. Commit with a specific message.
3. Record new commit SHA.
4. Check whatever deployment evidence is available.
5. Fetch the live site if possible.
6. Confirm the live HTML/asset version matches the intended commit or contains a unique change marker.
7. Run a minimal smoke test.
8. Only then state "published" or "verified live".

If deployment cannot be observed, say "committed to GitHub; production deployment not verified."

## Required smoke test after functional changes
Test at minimum:
- Add thought
- Edit thought
- Delete thought
- Archive + restore
- Add friend
- Edit friend
- Delete friend
- Change friend reminder frequency
- Fixed reminder
- Weekly reminder
- Biweekly reminder
- Monthly reminder
- Bimonthly reminder
- Random reminder
- Multiple due reminders
- Hebrew
- English
- Reload persistence
- Legacy data preserved
- iPhone-width layout
- Voice supported/unsupported path

## Anti-hallucination protocol
Before making a factual claim, classify it:
- VERIFIED IN REPO: directly read from current GitHub content.
- VERIFIED LIVE: directly checked on the live site.
- VERIFIED DEPLOYMENT: deployment status/result directly observed.
- INFERRED: reasonable conclusion from code/config, but not runtime verified.
- UNKNOWN: cannot currently verify.

Never convert INFERRED or UNKNOWN into VERIFIED language.

Never say:
- "deployed"
- "live"
- "working on iPhone"
- "ChatGPT site updated"
- "data transferred"
unless directly verified.

## Change discipline
- One conceptual change per commit when practical.
- No large redesign bundled with migration logic.
- Before risky changes, keep a rollback commit SHA.
- Do not delete the old storage keys.
- Do not delete app.js/app.css until the chosen source-of-truth migration is complete and verified.
- Do not change Cloudflare configuration unless explicitly required and inspected first.

## Checkpoint format
At the end of each phase, record in this file:
- Date/time
- Phase completed
- Commit SHA
- Files changed
- Data migration performed: yes/no
- Repo tests performed
- Live verification performed: yes/no
- Known remaining issues
- Next phase

## Current checkpoint
- Date: 2026-09-23
- Phase: Phase 6 client-side complete — permission flow and PWA push foundation added; background push backend still pending
- Pre-change HEAD: 67ba60e37e766f44fa3c1be7203ca18f2bcef100
- Functional commit: 756c4f5b692386a905a6d3a4c43ac1dc94e37869
- Files changed: thoughts-assistant/index.html, thoughts-assistant/app.js, thoughts-assistant/app.css, thoughts-assistant/manifest.webmanifest, thoughts-assistant/sw.js
- Data migration performed: no
- Notification UI: added explicit status panel and user-triggered Enable button
- Permission flow: Notification.requestPermission is called only from direct user interaction
- Status handling: granted/denied/default/unsupported states are presented separately
- iPhone guidance: when not running as a Home Screen app, the UI explains that closed-app notifications require adding the app to the Home Screen
- PWA foundation: standalone web-app manifest added and service worker registered
- Service worker: includes push-event notification display and notificationclick focus/open handling
- Foreground/in-app reminder state remains separate from system notification delivery
- Background push limitation: no PushManager subscription, VAPID keys, subscription storage or server sender exists yet; therefore notifications while the app is closed are NOT verified or complete
- External technical verification: Apple/WebKit documentation confirms iOS/iPadOS Home Screen web apps support Web Push via Push API, Notifications API and Service Workers, and that server-side push infrastructure is required
- Repo verification performed: yes — manifest link, permission UI, permission states, service-worker registration, push handler and click handler verified
- Runtime/live verification performed: no
- Known remaining issues: implement a secure push-subscription backend before claiming background notifications; live Home Screen/iPhone test still required
- Next intended phase: Phase 7 — ChatGPT-site migration path, unless backend Web Push is prioritized first
