# 📱 Monitoring App – Mobile UI Design Specification

## 1. Overview

This document defines the UI/UX design structure for a **Website Monitoring Mobile Application**. The design focuses on clarity, real-time visibility, and quick navigation, while introducing a **floating bottom navigation bar with glassmorphism effect** instead of a traditional hamburger menu.

---

## 2. Design Principles

* **Minimal & Clean UI** – Focus on metrics and readability
* **Status-first Design** – Health and uptime always visible
* **Card-based Layout** – Modular and scalable
* **Soft Shadows & Rounded Corners** – Modern mobile aesthetic
* **Glassmorphism Navigation** – iOS-like floating navigation experience

---

## 3. Navigation System (Updated)

### ❌ Removed

* Top-left hamburger menu (3-line icon)

### ✅ Added

* **Floating Bottom Navigation Bar**

### Navigation Style

* Positioned: **Bottom center (floating)**
* Shape: Rounded pill
* Background: Semi-transparent (glass effect)
* Blur: High backdrop blur (iOS style)
* Border: Subtle white/low opacity stroke
* Shadow: Soft elevation

### Navigation Items

1. Dashboard
2. Monitors
3. Analytics
4. Logs
5. Settings

### Behavior

* Active tab highlighted with:

  * Filled icon
  * Slight glow or tint
* Smooth transitions between screens
* Floating above content (not attached to bottom edge strictly)

---

## 4. Dashboard Screen

### Header

* Title: **Dashboard**
* Right CTA: **+ Add Monitor** (Primary button, gradient or solid accent)

---

### Summary Cards (Top Section)

Each card uses:

* Rounded corners
* Soft shadow
* Light background

#### 1. Total Uptime

* Value: Percentage (e.g., 100%)
* Status: "Live status" (green)
* Icon: Success indicator (check)

#### 2. Avg Response Time

* Value: e.g., 323ms
* Subtitle: Across all monitors
* Icon: Lightning / performance

#### 3. Active Incidents

* Value: Count (e.g., 0)
* Subtitle: "All systems go"
* Icon: Warning triangle

---

### Active Monitors Section

Each monitor card contains:

* Status indicator (green dot + "Healthy")
* Domain name
* Last check time
* Response time
* Mini sparkline graph

Interaction:

* Tap → Navigate to **Monitor Details Screen**

---

## 5. Add Monitor Modal

### Style

* Bottom sheet modal
* Rounded top corners
* Dimmed background overlay

### Fields

* Website URL (input)

### Actions

* Cancel (secondary)
* Add (primary)

---

## 6. Monitor Details Screen

### Header

* Back button
* URL title
* Status badge (Healthy)

### Sections

#### 1. Metrics Cards

* Avg Response
* Uptime (24h)
* Incidents

#### 2. Uptime History (45 Days)

* Horizontal bar visualization
* Colors:

  * Green = Up
  * Orange = Degraded
  * Red = Down

#### 3. Regional Response Times

* Line chart
* Tooltip on hover/tap
* Time vs latency visualization

#### 4. SSL Certificate Info

* Issued by
* Expiry date
* Progress bar for validity

#### 5. Domain Expiry

* Days remaining
* Registrar info
* Auto-renew status

#### 6. Alerts Section

* Alert summary
* CTA: Manage Alerts

#### 7. Danger Zone

* Remove Property button
* Warning styling (red tones)

---

## 7. Monitoring Graphs Screen

* Uptime timeline (extended e.g., 90 days)
* Response time chart (last 12 hours)
* Real-time updates

---

## 8. Logs Screen

### Features

* Table format
* Columns:

  * Time
  * Status
  * Code
  * Latency

### Controls

* Export button
* Filter (All logs)
* Pagination

---

## 9. Internal Notes Section

* User avatar
* Name + timestamp
* Message bubble
* Input field for new note
* Send button

---

## 10. Visual Design System

### Colors

* Green: Success / Healthy
* Blue: Info / Metrics
* Orange: Warning
* Red: Error / Danger
* Gray: Backgrounds & borders

### Typography

* Bold for key metrics
* Medium for labels
* Light for metadata

### Spacing

* Consistent padding (16–20px)
* Card spacing: 12–16px

### Components

* Cards
* Buttons (Primary / Secondary)
* Chips (status indicators)
* Charts

---

## 11. UX Enhancements

* Smooth transitions between screens
* Skeleton loaders for data fetch
* Real-time updates for metrics
* Pull-to-refresh support

---

## 12. Key Design Change Summary

| Old Design                | New Design |
| ------------------------- | ---------- |
| Hamburger menu            | ❌ Removed  |
| Top navigation dependency | ❌ Removed  |
| Static navigation         | ❌ Removed  |
| Bottom floating navbar    | ✅ Added    |
| Glassmorphism effect      | ✅ Added    |
| iOS-like feel             | ✅ Achieved |

---

## 13. Future Enhancements

* Dark mode support
* Push notifications UI
* Multi-monitor comparison view
* AI-based anomaly detection visualization

---

## ✅ Conclusion

This design transforms the monitoring app into a **modern, mobile-first, iOS-inspired experience** with a strong focus on accessibility, clarity, and real-time system visibility. The floating glassmorphism navigation enhances usability while keeping the interface clean and distraction-free.
