# CampusLoop

# Design Document (UI/UX Architecture)

Version: 1.0

Project Type: Academic Demonstration Platform

Design Philosophy:
Modern • Clean • Community-Driven • Marketplace-Focused • Student-Friendly

---

# 1. Design Vision

CampusLoop should feel like:

> "A modern student marketplace that combines the simplicity of Facebook Marketplace, the professionalism of LinkedIn, and the responsiveness of modern SaaS applications."

The interface must prioritize:

- Fast product discovery
- Easy communication
- Trust-building
- Mobile responsiveness
- Clean visual hierarchy

Avoid:

- Complex enterprise layouts
- Overloaded dashboards
- Excessive animations
- Dark-heavy interfaces by default

---

# 2. Visual Identity

## Brand Personality

CampusLoop should communicate:

- Trust
- Simplicity
- Community
- Accessibility
- Reliability

---

## Brand Keywords

- Student-Centric
- Friendly
- Modern
- Organized
- Connected

---

# 3. Color System

## Primary Colors

### Primary Blue

```css
#2563EB
```

Purpose:

- Primary CTA
- Active Navigation
- Primary Buttons

---

### Primary Hover

```css
#1D4ED8
```

---

## Secondary Colors

### Success

```css
#22C55E
```

Used For:

- Sold Items
- Successful Actions
- Verified Indicators

---

### Warning

```css
#F59E0B
```

Used For:

- Pending Review
- Expiring Listings

---

### Error

```css
#EF4444
```

Used For:

- Rejected Listings
- Validation Errors
- Reports

---

## Neutral Colors

### Background

```css
#F8FAFC
```

---

### Surface

```css
#FFFFFF
```

---

### Border

```css
#E2E8F0
```

---

### Text Primary

```css
#0F172A
```

---

### Text Secondary

```css
#64748B
```

---

# 4. Typography System

Font Family:

```text
Inter
```

Fallback:

```text
Sans-serif
```

---

## Typography Scale

### H1

```css
48px
700
```

Used:

- Hero Titles

---

### H2

```css
36px
700
```

---

### H3

```css
28px
600
```

---

### H4

```css
22px
600
```

---

### Body Large

```css
18px
400
```

---

### Body Regular

```css
16px
400
```

---

### Caption

```css
14px
400
```

---

# 5. Layout System

## Maximum Width

```css
1280px
```

Centered Container

---

## Grid

Desktop:

```css
12 Columns
```

---

Tablet:

```css
8 Columns
```

---

Mobile:

```css
4 Columns
```

---

# 6. Spacing System

Base Unit:

```css
8px
```

Scale:

```css
4
8
12
16
24
32
48
64
96
```

---

# 7. Border Radius System

Small

```css
8px
```

Medium

```css
12px
```

Large

```css
16px
```

Extra Large

```css
24px
```

---

# 8. Shadow System

Card Shadow

```css
0 2px 8px rgba(0,0,0,.08)
```

---

Modal Shadow

```css
0 12px 32px rgba(0,0,0,.15)
```

---

Hover Shadow

```css
0 8px 24px rgba(0,0,0,.12)
```

---

# 9. Button Design System

## Primary Button

Background:

```css
#2563EB
```

Text:

```css
#FFFFFF
```

Radius:

```css
12px
```

Height:

```css
48px
```

Hover:

```css
#1D4ED8
```

---

## Secondary Button

Background:

```css
White
```

Border:

```css
#E2E8F0
```

Text:

```css
#0F172A
```

---

## Danger Button

Background:

```css
#EF4444
```

---

# 10. Input System

Input Height

```css
48px
```

Radius

```css
12px
```

Border

```css
#CBD5E1
```

Focus Border

```css
#2563EB
```

---

# 11. Navigation Design

## Desktop Navbar

Structure:

```text
Logo

Browse
Categories
Favorites
Messages

Search Bar

Notifications
Profile
```

Height:

```css
72px
```

Sticky Top

---

## Mobile Navigation

Bottom Navigation

Items:

- Home
- Search
- Add Listing
- Messages
- Profile

---

# 12. Homepage Design

---

## Hero Section

Layout:

Left:

- Headline
- Description
- CTA Buttons

Right:

- Marketplace Illustration

Headline:

```text
Buy, Sell & Connect Across Campus
```

Buttons:

- Browse Listings
- Create Listing

---

## Categories Section

Grid Layout

Cards:

- Books
- Electronics
- Furniture
- Notes
- Services
- Others

---

## Featured Listings

Responsive Product Grid

Desktop:

4 Columns

Tablet:

2 Columns

Mobile:

1 Column

---

## How It Works Section

3 Steps

1. Create Account
2. List Item
3. Connect & Trade

---

# 13. Listing Card Design

Components:

- Product Image
- Title
- Price
- Category
- Condition
- Seller Rating
- Favorite Button

Hover Effect:

- Slight Elevation
- Shadow Increase

---

# 14. Product Details Page

Layout

Desktop:

```text
Images | Product Information
```

---

Information Section

Includes:

- Title
- Price
- Condition
- Seller
- Rating
- Description

Actions:

- Chat Seller
- Save Listing
- Report Listing

---

# 15. Messaging Interface

Layout:

```text
Conversation List | Chat Window
```

---

Conversation List

Shows:

- Avatar
- Last Message
- Timestamp

---

Chat Window

Supports:

- Text
- Images
- PDF
- Documents
- Voice

---

Input Area

Contains:

- Text Box
- File Upload
- Voice Upload
- Send Button

---

# 16. User Dashboard

Sidebar

```text
Dashboard

My Listings
Favorites
Messages
Notifications
Reviews
Settings
```

---

Dashboard Widgets

- Active Listings
- Sold Listings
- Messages
- Reviews

---

# 17. Create Listing Page

Sections

### Basic Information

- Title
- Description
- Category

---

### Pricing

- Price
- Negotiable Toggle

---

### Product Information

- Condition
- Expiration Setting

---

### Media Upload

Multiple Images

Drag & Drop

---

# 18. Favorites Page

Grid Layout

Displays:

- Saved Listings
- Quick Remove
- Quick Chat

---

# 19. Notifications Page

Grouping

Today

Yesterday

Earlier

Statuses

- Read
- Unread

---

# 20. Moderator Dashboard

Sections

- Pending Listings
- AI Flags
- Reports Queue
- User Violations

---

Widgets

- Pending Reviews
- Open Reports
- AI Risk Scores

---

# 21. Admin Dashboard

Sidebar

```text
Dashboard
Users
Listings
Categories
Reports
Moderators
AI Providers
API Keys
Analytics
Settings
```

---

# 22. API Key Management UI

Table Layout

Columns

- Provider
- Key Name
- Priority
- Status
- Usage
- Failures
- Last Used

Actions

- Add
- Disable
- Delete

---

# 23. Analytics Dashboard

Charts

- User Growth
- Listing Growth
- Messages Activity
- Reports Activity

Cards

- Total Users
- Active Listings
- Messages Sent
- Reviews

---

# 24. Modal Design

Used For

- Delete Confirmation
- Report Submission
- User Suspension
- API Key Creation

---

# 25. Responsive Design Rules

Desktop

```css
≥ 1280px
```

---

Laptop

```css
1024px–1279px
```

---

Tablet

```css
768px–1023px
```

---

Mobile

```css
≤ 767px
```

---

# 26. Accessibility Requirements

Minimum Contrast:

```css
4.5: 1;
```

Requirements:

- Keyboard Navigation
- Focus States
- Screen Reader Labels
- Semantic HTML

---

# 27. Animation Guidelines

Use:

- Framer Motion

Animation Duration

```css
150ms–300ms
```

Allowed:

- Card Hover
- Modal Open
- Page Transition

Avoid:

- Excessive Motion
- Heavy Effects

---

# 28. Design Goals Validation

A design is accepted when:

✓ Responsive on all devices

✓ Listing discovery is simple

✓ Chat is intuitive

✓ Dashboard is organized

✓ Admin panel is manageable

✓ Marketplace feels trustworthy

✓ Visual hierarchy is clear

✓ Accessibility standards met

---

# End of Design Document
