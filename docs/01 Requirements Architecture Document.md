# CampusLoop

## Requirements Architecture Document (RAD)

Version: 1.0

Project Type: Academic Demonstration System

Project Name:
CampusLoop — A Student Marketplace & Real-Time Communication Platform

---

# 1. System Overview

CampusLoop is a centralized student-focused marketplace and communication platform that enables university students, teachers, and staff members to buy, sell, exchange, and communicate within a secure campus ecosystem.

The platform combines:

- Marketplace Management
- Real-Time Communication
- User Verification
- Rating & Reputation
- Administration & Moderation
- AI-Assisted Moderation
- Notification Management

into a single unified system.

The primary objective is to eliminate reliance on fragmented Facebook groups and messaging systems by providing a structured university-focused platform.

---

# 2. System Objectives

## Business Objectives

- Enable safe student-to-student transactions
- Improve discoverability of campus listings
- Provide structured communication
- Reduce marketplace spam
- Increase trust through ratings and verification
- Centralize campus trading activities

---

## Technical Objectives

- Modular architecture
- RESTful API architecture
- Scalable database design
- Real-time messaging
- Cloud-based media storage
- Role-based access control
- AI-powered moderation support

---

# 3. User Role Matrix

## Guest

Permissions:

- View homepage
- Browse public listings
- Search listings
- View listing details
- Register account
- Login

Restrictions:

- Cannot chat
- Cannot create listings
- Cannot rate users
- Cannot save favorites

---

## Student

Permissions:

- Manage profile
- Create listings
- Upload images
- Chat with users
- Save favorites
- Submit reviews
- Report content
- Receive notifications
- Manage own listings

---

## Teacher

Permissions:

- Same as student
- Additional verified educator badge (future)

---

## Staff

Permissions:

- Same as student

---

## Moderator

Permissions:

- Review reports
- Moderate chats
- Moderate listings
- Suspend users
- Approve flagged content
- Review AI moderation queue

Restrictions:

- Cannot modify system settings

---

## Admin

Full platform access.

Permissions:

- User management
- Listing management
- Category management
- Report management
- Notification management
- Analytics dashboard
- API Key Management
- AI Configuration
- System Configuration
- Moderator Management

---

# 4. System Modules

---

## Module 1 — Authentication & Authorization

Purpose:

Manage identity and access control.

Features:

- Registration
- Login
- Forgot Password
- Password Reset
- Role Assignment
- JWT Authentication
- Session Management

Future Features:

- University Verification
- Student ID Verification
- University Email Verification

---

## Module 2 — User Profile Management

Purpose:

Manage personal account information.

Features:

- Profile Update
- Avatar Upload
- Bio
- Contact Information
- University Information
- Account Preferences

Settings:

- Listing Expiration Default
- Notification Preferences
- Privacy Settings

---

## Module 3 — Marketplace Management

Purpose:

Core listing engine.

Features:

- Create Listing
- Edit Listing
- Delete Listing
- Pause Listing
- Mark as Sold
- Renew Listing
- Listing Expiration Control

Supported Categories:

- Books
- Electronics
- Furniture
- Lab Equipment
- Clothing
- Notes
- Services
- Others

Future:

Admin-defined categories.

---

## Module 4 — Media Management

Purpose:

Manage listing assets.

Features:

- Multiple Image Upload
- Image Preview
- Image Removal
- Cloud Storage Integration

Integrations:

- Cloudinary

---

## Module 5 — Search & Discovery

Purpose:

Help users find relevant listings.

Filters:

- Category
- Price Range
- Condition
- Date Posted
- Seller Rating

Future:

- University Filter
- AI Search

Sorting:

- Latest
- Oldest
- Price Low to High
- Price High to Low
- Most Popular

---

## Module 6 — Favorites System

Purpose:

Allow users to bookmark listings.

Features:

- Add Favorite
- Remove Favorite
- Favorite Dashboard

---

## Module 7 — Real-Time Messaging

Purpose:

Buyer-seller communication.

Features:

- Real-Time Chat
- Offline Messaging
- Image Sharing
- PDF Sharing
- Document Sharing
- Voice Message Sharing

Chat Controls:

- Block User
- Report User
- Delete Conversation

Technology:

- Socket.IO

---

## Module 8 — Ratings & Reviews

Purpose:

Build trust.

Features:

- Seller Ratings
- Buyer Ratings
- Written Reviews
- Average Score Calculation

Metrics:

- Total Reviews
- Average Rating
- Completed Transactions

---

## Module 9 — Reporting & Moderation

Purpose:

Reduce abuse and spam.

Report Types:

- Listing Report
- Profile Report
- Message Report

Moderation Actions:

- Warning
- Hide Listing
- Remove Listing
- Suspend User
- Ban User

---

## Module 10 — AI Moderation System

Purpose:

Automated moderation support.

Functions:

- Spam Detection
- Duplicate Listing Detection
- Toxic Content Detection
- Scam Pattern Detection

Workflow:

User Submission
→ AI Screening
→ Moderation Queue
→ Moderator Review
→ Approval/Rejection

---

## Module 11 — Notification System

Purpose:

User activity updates.

Notification Types:

- New Message
- Listing Approved
- Listing Sold
- Review Received
- Report Status Update

Delivery Methods:

- In-App Notifications
- Real-Time Push Notifications

---

## Module 12 — API Key Management System

Purpose:

Centralized AI provider management.

Access:

- Admin
- Moderator

Features:

- Add API Key
- Disable API Key
- Delete API Key
- Prioritize API Keys
- Usage Tracking

Supported Providers:

- OpenAI
- Gemini
- Groq
- Claude
- Future Providers

---

## API Key Rotation Engine

Purpose:

Automatic failover.

Workflow:

Request
↓
Primary Key
↓
Rate Limit Hit?
↓
Yes
↓
Switch To Next Active Key
↓
Continue Processing

Capabilities:

- Auto Rotation
- Failover Recovery
- Health Monitoring
- Usage Tracking
- Error Logging

---

## Module 13 — Analytics Dashboard

Purpose:

Platform monitoring.

Metrics:

- Total Users
- Active Users
- Listings Count
- Category Distribution
- Messages Sent
- Reports Created
- AI Moderation Statistics

---

# 5. Integration Matrix

| Integration    | Purpose        |
| -------------- | -------------- |
| Laravel API    | Backend        |
| React Frontend | UI             |
| MySQL          | Database       |
| Cloudinary     | Image Storage  |
| Socket.IO      | Real-Time Chat |
| AI APIs        | Moderation     |
| JWT            | Authentication |

---

# 6. Non-Functional Requirements

Performance:

- Page Load < 3 Seconds
- Search Response < 1 Second
- Chat Latency < 500ms

Scalability:

- 10,000+ Users
- 20,000+ Listings

Availability:

- 99% uptime target

Maintainability:

- Modular architecture
- Service-oriented backend

---

# 7. Security Model

Authentication:

- JWT

Authorization:

- RBAC

Security Features:

- Password Hashing
- Rate Limiting
- Input Validation
- XSS Protection
- CSRF Protection
- File Validation
- Secure Upload Handling

---

# 8. Compliance Requirements

- User Content Governance
- Privacy Protection
- Secure Credential Storage
- Audit Logging

---

# 9. Developer Deliverables

Frontend:

- React Application
- Responsive UI
- Real-Time Chat Interface

Backend:

- Laravel REST API
- JWT Authentication
- Moderation Engine

Database:

- MySQL Schema
- Relationships
- Indexing Strategy

Deployment:

- Frontend Deployment
- Backend Deployment
- Database Configuration

---

# End of Requirements Architecture Document
