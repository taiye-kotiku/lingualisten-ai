# CMS Integration Guide & Requirements

This document outlines the client's answers to key implementation questions. It will serve as the primary guide for integrating the Google Sheets CMS and implementing related backend logic.

---

## PHYSICAL FLASHCARDS

**1. What format do the codes on flashcards take?**
- **Answer:** Both alphanumeric (e.g., X7KD4) and QR codes.

**2. How are the codes generated and managed? Will the developer generate QR codes?**
- **Answer:** Codes will be generated automatically. The developer is responsible for generating the corresponding QR codes.

**3. Are codes unique per flashcard, or reused?**
- **Answer:** Codes are unique for each flashcard.

**4. How are flashcards distributed or printed?**
- **Answer:** No specific format required. Any method that works is acceptable.

**5. Do flashcards include visible categories/lessons?**
- **Answer:** No, the flashcards will only contain the necessary elements to get the text and audio. Category information is stored in the backend.

---

## AUDIO CLIPS & PHRASES

**1. How are audio files named and linked to codes?**
- **Answer:** Any naming convention can be used. We will link audio files to phrases via URLs in the CMS.

**2. What file format and average length are the audio clips?**
- **Answer:** MP3 or WAV. The length will vary depending on the phrase.

**3. Are there multiple languages?**
- **Answer:** Yes, the app will support Yoruba and English.

**4. Is there text content associated with each phrase?**
- **Answer:** Yes, each entry will have the Yoruba phrase and its English translation.

---

## CONTENT STRUCTURE

**1. How is content grouped?**
- **Answer:** Content is grouped by `Categories` (e.g., Greetings, Questions, etc.).

**2. Should users browse content manually, or only via code?**
- **Answer:** Users should be able to do both. This confirms the necessity of the `BrowseScreen`.

**3. Is content dynamic or static?**
- **Answer:** The content is dynamic and will be managed from the CMS.

---

## FLASHCARD–CONTENT MAPPING (Google Sheets Schema)

**1. What fields should each record include?**
- **Answer:** Each row in the Google Sheet will represent a phrase and must contain the following columns:
  - `id`: A unique identifier for the record.
  - `code`: The alphanumeric code for the flashcard.
  - `phrase_yoruba`: The phrase in Yoruba.
  - `phrase_english`: The English translation.
  - `audio_yoruba_url`: The URL to the Yoruba audio file.
  - `audio_english_url`: The URL to the English audio file.
  - `category`: The category the phrase belongs to.
  - `status`: The state of the content (e.g., `published`, `draft`).

**2. Can codes map to multiple audio versions?**
- **Answer:** Yes. The schema supports separate audio files for both Yoruba and English.

**3. What should happen with invalid/expired codes?**
- **Answer:** They should be deleted or recycled from the CMS. The app should handle a "Not Found" error gracefully.

---

## APP BEHAVIOR / UX FLOW

**1. Expected flow after code entry/scan?**
- **Answer:** The app should navigate to the `ContentDisplayScreen`, showing the phrase text with an option to play the audio. This matches the current implementation.

**2. Can users save/bookmark content?**
- **Answer:** Yes. A "Favorites" or bookmarking feature needs to be implemented.

**3. Is there any history or progress tracking?**
- **Answer:** The app should track history (e.g., "Recent Activity"). It does not need to track progress (e.g., lesson completion).

**4. Should audio stream or cache for offline use?**
- **Answer:** The app should support downloading content for offline use.

---

## ADMIN BACKEND (CONTENT MGMT)

**1. Where will content be stored?**
- **Answer:** Google Sheets.

**2. What fields will be tracked per record?**
- **Answer:** A unique ID (`id`) will be the primary key for each record.

**3. Will flashcard codes also be managed in this backend?**
- **Answer:** Yes, the `code` for each flashcard will be in the Google Sheet.

**4. Should draft/published states be supported?**
- **Answer:** Yes, a `status` column will manage this. The app should only fetch records with a `published` status.

**5. How should syncing work?**
- **Answer:** The app should support both real-time fetching on load and a manual refresh mechanism (e.g., pull-to-refresh). 