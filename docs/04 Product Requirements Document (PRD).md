# CampusLoop

# Product Requirements Document (PRD)

Version: 1.0

Status: Approved for Architecture & Development

Project Type: Academic Demonstration Platform

Project Name:
CampusLoop — A Student Marketplace & Real-Time Communication Platform

---

# 1. Executive Summary

CampusLoop is a university-focused marketplace and communication platform designed to facilitate buying, selling, exchanging, and communication among students, teachers, and staff members.

The platform provides a secure ecosystem where users can create listings, communicate through real-time messaging, build reputation through ratings and reviews, and interact within a structured campus marketplace.

The system aims to replace fragmented Facebook groups and informal communication channels with a dedicated university trading network.

---

# 2. Product Vision

To become the central digital marketplace and communication hub for university communities.

CampusLoop connects campus members through trusted commerce, communication, and community engagement.

---

# 3. Problem Statement

Current university trading activities rely heavily on:

- Facebook Groups
- Messenger
- WhatsApp
- Telegram

These platforms create multiple problems:

### Marketplace Problems

- Poor search capabilities
- Duplicate listings
- No structured categories
- Difficult item discovery

### Communication Problems

- Lost conversations
- Unorganized buyer inquiries
- No transaction context

### Trust Problems

- Fake profiles
- Scam attempts
- No reputation system
- Lack of moderation

---

# 4. Product Goals

## Primary Goals

### G1

Provide a centralized marketplace for university communities.

---

### G2

Enable real-time communication between buyers and sellers.

---

### G3

Build trust through ratings, reviews, and moderation.

---

### G4

Reduce spam and fraudulent activities.

---

### G5

Create a scalable foundation for future university services.

---

# 5. Target Audience

---

## Persona 1 — Student Seller

Name:
Arafat

Needs:

- Sell used books
- Sell electronics
- Sell furniture

Pain Points:

- Difficult buyer discovery
- Unorganized communication

Success Criteria:

- Fast listing creation
- Easy buyer interaction

---

## Persona 2 — Student Buyer

Name:
Mahi

Needs:

- Find affordable products
- Compare offers
- Contact sellers

Pain Points:

- Limited searchability
- Fake listings

Success Criteria:

- Easy product discovery
- Safe communication

---

## Persona 3 — Teacher

Needs:

- Buy and sell educational resources
- Participate in university marketplace

Success Criteria:

- Reliable environment
- Professional interactions

---

## Persona 4 — Staff Member

Needs:

- Access internal marketplace
- Exchange products/services

Success Criteria:

- Simple and secure experience

---

## Persona 5 — Moderator

Needs:

- Efficient content review
- Spam detection

Success Criteria:

- Fast moderation workflow

---

## Persona 6 — Administrator

Needs:

- Manage platform
- Manage users
- Manage AI services

Success Criteria:

- Complete platform visibility

---

# 6. Product Scope

---

## Included In MVP

### Authentication

- Registration
- Login
- Password Reset

---

### Marketplace

- Create Listing
- Edit Listing
- Delete Listing
- Pause Listing
- Mark Sold

---

### Search

- Keyword Search
- Advanced Filters

---

### Favorites

- Save Listings
- Remove Favorites

---

### Messaging

- Real-Time Chat
- File Sharing
- Voice Messages

---

### Reviews

- Ratings
- Reviews

---

### Moderation

- Reporting
- AI Screening
- Moderator Queue

---

### Notifications

- In-App Notifications

---

### API Management

- API Key Pool
- Automatic Rotation

---

## Excluded From MVP

- Mobile Applications
- Payment Gateway
- Multi-University Support
- University Verification
- AI Recommendation Engine
- AI Semantic Search

---

# 7. User Journey Maps

---

## Journey A — Selling an Item

```text
Login
↓
Create Listing
↓
Upload Images
↓
Submit
↓
AI Moderation
↓
Approval
↓
Listing Published
↓
Receive Messages
↓
Mark Sold
↓
Receive Review
```

---

## Journey B — Buying an Item

```text
Browse Listings
↓
Apply Filters
↓
Open Listing
↓
Contact Seller
↓
Chat
↓
Purchase
↓
Leave Review
```

---

## Journey C — Reporting Content

```text
View Listing
↓
Report Content
↓
Moderator Review
↓
Action Taken
↓
Notification Sent
```

---

# 8. Functional Requirements

---

## FR-01 Authentication

Users shall be able to:

- Register
- Login
- Logout
- Reset Password

Priority:

Must Have

---

## FR-02 Listing Management

Users shall be able to:

- Create Listings
- Edit Listings
- Delete Listings
- Pause Listings
- Renew Listings
- Mark Listings Sold

Priority:

Must Have

---

## FR-03 Search System

Users shall be able to search by:

- Category
- Price
- Condition
- Date
- Seller Rating

Priority:

Must Have

---

## FR-04 Messaging System

Users shall be able to:

- Send Text
- Send Images
- Send PDFs
- Send Documents
- Send Voice Messages

Priority:

Must Have

---

## FR-05 Favorites

Users shall be able to save listings.

Priority:

Must Have

---

## FR-06 Ratings

Users shall be able to:

- Rate Sellers
- Rate Buyers
- Submit Reviews

Priority:

Must Have

---

## FR-07 Moderation

Moderators shall be able to:

- Review Reports
- Approve Listings
- Suspend Users

Priority:

Must Have

---

## FR-08 AI Moderation

System shall:

- Detect Spam
- Detect Toxic Content
- Detect Duplicate Listings

Priority:

Should Have

---

## FR-09 Notifications

System shall notify users for:

- Messages
- Reviews
- Listing Status

Priority:

Must Have

---

## FR-10 API Key Management

Admins and Moderators shall:

- Add API Keys
- Disable Keys
- Track Usage

System shall:

- Automatically Rotate Keys

Priority:

Must Have

---

# 9. AI API Rotation Requirements

CampusLoop supports multiple API keys.

Example:

```text
Groq Key 1
Groq Key 2
Groq Key 3
Gemini Key 1
OpenAI Key 1
```

Execution Logic:

```text
Request
↓
Current Key
↓
Rate Limit?
↓
Yes
↓
Switch Next Active Key
↓
Continue
```

Requirements:

- Automatic Failover
- Usage Tracking
- Health Monitoring
- Error Recovery

---

# 10. Non-Functional Requirements

---

## Performance

Page Load:

< 3 Seconds

---

Search Response:

< 1 Second

---

Chat Delivery:

< 500ms

---

## Security

- JWT Authentication
- Password Hashing
- RBAC
- Input Validation
- Rate Limiting

---

## Reliability

Target Availability:

99%

---

## Scalability

Target:

- 10,000 Users
- 20,000 Listings

---

# 11. Success Metrics

---

## User Metrics

Registered Users

Target:

2,000+

---

Active Users

Target:

60%

---

## Marketplace Metrics

Listings Created

Target:

5,000+

---

Listing Success Rate

Target:

70%

---

## Communication Metrics

Messages Sent

Target:

50,000+

---

Average Response Time

Target:

< 12 Hours

---

## Moderation Metrics

Spam Detection Accuracy

Target:

90%

---

Moderator Resolution Time

Target:

24 Hours

---

# 12. Release Plan

---

## Phase 1

Foundation

- Authentication
- User Profiles
- Listings

---

## Phase 2

Marketplace

- Search
- Favorites
- Categories

---

## Phase 3

Communication

- Real-Time Chat
- Attachments
- Voice Messages

---

## Phase 4

Trust Layer

- Ratings
- Reviews
- Reports

---

## Phase 5

Administration

- Moderation
- Analytics
- Notifications

---

## Phase 6

AI Layer

- AI Moderation
- API Key Rotation
- Usage Monitoring

---

# 13. Future Roadmap

---

Version 2

- Student Verification
- University Email Verification
- Verified Badges

---

Version 3

- Multi-University Support
- Campus Switching

---

Version 4

- AI Search
- AI Recommendations
- Smart Categorization

---

Version 5

- Mobile Application
- Push Notifications
- Student Community Features

---

# 14. Acceptance Criteria

Project is accepted when:

✓ Users can register and login

✓ Users can create and manage listings

✓ Users can search products

✓ Users can communicate through real-time chat

✓ Users can exchange files

✓ Users can submit ratings and reviews

✓ Moderators can manage reports

✓ Admins can manage API keys

✓ API rotation works automatically

✓ Notifications function correctly

✓ Database integrity maintained

✓ System passes academic demonstration requirements

---

# End of Product Requirements Document (PRD)
