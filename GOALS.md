# Project Roadmap

This document outlines the development goals for the RSS Update Notifier, transforming it from a simple client-side utility into a robust, shareable, and feature-rich application.

## Phase 1: Personal Power User (Current Focus)
**Goal:** Enhance the utility for personal use, specifically targeting Reddit tracking and reliability.

*   **Reddit Integration:**
    *   Add automatic detection of Reddit thread URLs.
    *   Auto-append `.rss` to reddit links to seamlessly subscribe to thread comments.
    *   **Status:** In Progress.
*   **Robust Parsing:**
    *   Upgrade the RSS parser to handle **Atom 1.0** feeds (used by Reddit) in addition to RSS 2.0.
    *   Normalize data fields (title, link, date) across different feed formats.
    *   **Status:** In Progress.

## Phase 2: The "Shareable" Foundation
**Goal:** Remove dependencies on unstable public proxies to make the app reliable for others and ready for a portfolio showcase.

*   **Serverless Proxy:**
    *   Replace `cors-anywhere.herokuapp.com` with a custom serverless function (Netlify Functions or Vercel).
    *   **Why:** Public proxies are rate-limited and often blocked by major sites (like Reddit). A private proxy ensures consistent access.
    *   **Implementation:** A simple Node.js function acting as a middleware to add CORS headers.
    *   **Status:** In Progress.

## Phase 3: Portfolio Polish (Future)
**Goal:** Improve UX/UI and features for a broader audience.

*   **Feed Grouping:** Categorize feeds (e.g., "News", "Tech", "Social").
*   **Data Persistence:** Sync settings across devices (potentially using a lightweight backend or browser sync).
*   **PWA Support:** Make the app installable on mobile devices.
*   **Visual Overhaul:** Polish the UI with better loading states and error handling.
