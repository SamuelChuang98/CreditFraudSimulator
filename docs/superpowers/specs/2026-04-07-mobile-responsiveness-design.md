# Mobile Responsiveness Design

**Date:** 2026-04-07
**Project:** Fraud Simulator 3
**Goal:** Make the app presentable on mobile screens (read-only demo use case)

## Context

The app is a single monolithic React component (`frontend/src/App.jsx`, ~2,400 lines) using 100% inline styles. It has three tabs: Simulator, Research Questions, and Analysis. The primary mobile use case is showing the demo to someone on a phone — not full interactive use.

## Approach

**CSS media queries in `index.html`** — additive only, no existing inline styles removed. Key elements in `App.jsx` get `className` attributes so the media queries can target them. JS-controlled values (drawer width) get a `useWindowWidth` hook.

Single breakpoint: **768px**.

## What Changes at ≤ 768px

### Layout
- Main simulator grid: `1fr 1fr` → `1fr` (form stacks above results)
- Stats cards: `1fr 1fr 1fr` → `1fr 1fr`
- 4-column metrics row: `1fr 1fr 1fr 1fr` → `1fr 1fr`
- RQ2 feature cards: `1fr 1fr` → `1fr`
- Main container padding: `32px 24px` → `16px 12px`

### Tables (horizontal scroll)
- Transaction log (8-col): wrap in `overflow-x: auto`
- Analysis transaction table (7-col): wrap in `overflow-x: auto`
- RQ3 model performance table (5-col): wrap in `overflow-x: auto`

### Drawer
- Desktop: 430px fixed side panel
- Mobile: 100vw full-width overlay — controlled via `useWindowWidth` hook in `App.jsx`

### Tab Bar
- Font size reduced, tabs wrap to second line if needed

### SVG Charts
- Wrap in `overflow-x: auto` container so they scroll horizontally rather than getting clipped

## Implementation Plan

1. Add `className` to targeted elements in `App.jsx`
2. Add `@media (max-width: 768px)` block to `frontend/index.html`
3. Add `useWindowWidth` hook and update drawer width logic in `App.jsx`

## Out of Scope

- Full interactive mobile UX (form inputs, analysis runs)
- Per-column table collapsing to card layout
- Tablet-specific breakpoints (768px–1024px)
