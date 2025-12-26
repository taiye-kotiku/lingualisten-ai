# CMS Integration Tasks

Use this checklist (Kanban-style) to track the work required to wire the app to the Google Sheets CMS specified in `cms_integration_guide.md`.

---

## Legend
- **[ ] Not Started**
- **[>] In Progress**
- **[x] Completed**

---

## 1  CMS Setup
- [x] Create Google Sheet with the required schema.
- [x] Publish Sheet as **CSV** (or enable Sheets API) and copy public URL / API key.
- [x] Add credentials (URL, API key) to `.env` and commit **.env.example**.

## 2  Data Models & Types
- [x] Add `src/types/phrase.ts` with `Phrase`, `Category`, `SheetRow` interfaces.
- [ ] Extend `src/types/navigation.ts` to accept `phrase` param for `ContentDisplayScreen`.

## 3  Service Layer (`contentService.ts`)
- [x] Fetch & parse CSV with `papaparse`.
- [x] Filter rows where `status === "published"` (or empty).
- [x] Implement methods:
  - `getAll(): Promise<Phrase[]>`
  - `getByCode(code: string): Promise<Phrase | null>`
  - `refresh(): Promise<void>` (force re-download)
- [x] Cache JSON in `AsyncStorage` (`@contentCache`).
- [x] Export React hook `useContent()` for components.

## 4  UI Wiring
- [x] **HomeScreen** – on "Submit Code" call `getByCode`; navigate or show "Not found".
- [x] **BrowseScreen** – replace dummy list with `getAll()`; add pull-to-refresh (`refresh()`); category chips.
- [x] **ContentDisplayScreen** – render live phrase + audio; download audio via `expo-av` → `downloadAsync`; cache with `FileSystem`.

## 5  State, Errors & Loading
- [x] Show `LoadingSpinner` while fetching.
- [x] Use `EmptyState` on 404 / empty list.
- [x] Show global toast/banner for network errors.

## 6  Offline Support (Light)
- [x] On app start, read cached JSON; then `refresh()` in background.
- [x] If offline, fall back to cache and display an "Offline mode" banner.

## 7  Onboarding (Optional Polish)
- [x] Implement `OnboardingModal` explaining code scan, browse, offline use.

## 8  Tests & Linting
- [ ] Unit tests for `contentService` (mock fetch & CSV parsing).
- [ ] Ensure ESLint & Prettier pass.

## 9  CI/CD & EAS
- [ ] Create / update `eas.json` with **dev**, **preview**, **prod** profiles.
- [ ] Add `.env.example` & `app.config.ts` for env vars.
- [ ] Build dev client (`eas build --profile development`).

## 10  QA & Release
- [ ] Smoke test on iOS & Android (online & offline scenarios).
- [ ] Verify Sheet updates appear after `refresh()`.
- [ ] Tag `v1.0` and run `eas submit` for app stores. 