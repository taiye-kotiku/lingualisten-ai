Perfect — here's the **full PRD written out inline**:

---

# Product Requirements Document (PRD)

## Project Title

**Language Learning Mobile App (MVP)**

---

## Purpose

To build a mobile application that allows users to scan or manually enter codes found on physical flashcards to access corresponding audio phrases. The product delivers a lightweight but scalable language-learning experience that enables non-technical content management via Airtable or Google Sheets.

---

## Goals

* Deliver a simple and intuitive flashcard-to-audio learning experience.
* Launch a cross-platform MVP compatible with iOS and Android.
* Make content creation and updates manageable by non-developers.
* Ensure future scalability with a clean architecture and modular design.

---

## Target Users

* Language learners of all ages
* Teachers or tutors using physical flashcards in classes
* Parents supporting home-based education
* Learners in environments with intermittent internet connectivity

---

## Core Features

### 1. **Authentication**

* Email-based sign-up and login
* Basic validation and password recovery
* Secure storage of credentials (e.g., encrypted with Firebase Auth)

### 2. **Code Entry & Interaction**

* Manual input of alphanumeric codes
* Optional QR code scanning
* Input maps directly to specific content (phrase + audio)

### 3. **Content Display**

* Shows phrase text and audio playback interface
* Associated metadata (e.g., category, translation if needed)

### 4. **Audio Playback**

* Stream or cache audio clips
* Play/Pause controls
* Optional: progress bar or duration display

### 5. **Content Browsing (Optional in MVP)**

* Grid/List view of flashcards
* Grouping by lessons, categories, or levels
* Optional filtering or search

### 6. **Push Notifications (Setup Only)**

* Placeholder setup using Firebase Cloud Messaging
* No scheduled campaigns during MVP
* Ready for future "reminder" or "new content" notifications

### 7. **No-Code Admin Backend (CMS)**

* Airtable or Google Sheets with editable fields:

  * `code`
  * `phrase text`
  * `audio file URL`
  * `category` or `lesson`
* App pulls data dynamically or on-demand (manual refresh)

---

## UI/UX Requirements

* Minimal, clean, and user-friendly design
* Mobile-first layout (phones > tablets)
* Brand-aligned colors, typography, and icons
* Responsive layout with accessibility considerations
* Onboarding or tutorial modal (optional)

---

## Non-Functional Requirements

* Cross-platform support via React Native (or FlutterFlow if needed)
* Basic offline caching for audio (if needed)
* Lightweight performance and fast load time
* Error handling for invalid codes and broken audio links
* Basic encryption for sensitive data (e.g., credentials)

---

## Technical Assumptions

* Flashcard codes are **unique** and **fixed** (not reused)
* Audio clips are hosted on public URLs (CDN or file server)
* Admin will maintain content in Airtable or Google Sheets
* No backend CMS or advanced analytics in MVP
* QR code format is standard (URL-encoded or plain text)

---

## Out of Scope for MVP

* Gamification, scoring, or badges
* Subscription model or in-app purchases
* Full offline mode
* Native admin dashboard or content moderation tools
* Advanced analytics or usage tracking

---

## Deliverables

* Fully functional iOS and Android apps
* Clean, well-commented source code
* Airtable or Google Sheets CMS structure
* App build files: TestFlight build for iOS, APK & AAB for Android
* Submission guide for App Store and Play Store
* 2 weeks post-delivery support (bug fixes, minor UI tweaks)

---

## Timeline (14 Days Total)

**Week 1**

* Day 1–3: App layout, navigation, static UI screens
* Day 4–7: Mock code-to-content linkage, audio playback setup

**Week 2**

* Day 8–11: Admin CMS integration, error states, UI polish
* Day 12–14: Final testing, build export, and client handoff

---

## Success Criteria

* User can enter/scan code and hear audio playback
* All content is dynamically pulled from Airtable/Sheets
* App passes core device testing (iOS/Android phones)
* Clean UX with no critical bugs
* Client has full ownership and deployment readiness

---