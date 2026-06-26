# CampusLoop

## Functional Specification Document (FSD)

Version: 1.0

Project Type: Academic Demonstration System

---

# 1. Functional Overview

CampusLoop is a student marketplace and communication platform supporting:

- Marketplace Operations
- User Communication
- Moderation
- Ratings & Reviews
- AI-Assisted Moderation
- Notification Management
- API Key Rotation Management

---

# 2. Authentication Module

## Functionalities

### User Registration

Actors:

- Guest

Workflow:

1. Open Registration Page
2. Enter Information
3. Submit Form
4. System Validates Data
5. User Created
6. Redirect to Login

Validation Rules:

- Name Required
- Email Required
- Unique Email
- Password Minimum 8 Characters
- Password Confirmation Required

---

### User Login

Actors:

- Student
- Teacher
- Staff
- Moderator
- Admin

Workflow:

1. Enter Credentials
2. Validate Credentials
3. Generate JWT Token
4. Create Session
5. Redirect Dashboard

---

### Password Reset

Workflow:

1. Request Reset
2. Generate Token
3. Send Email
4. Verify Token
5. Update Password

---

## CRUD Matrix

| Operation       | User |
| --------------- | ---- |
| Create Account  | Yes  |
| Read Profile    | Yes  |
| Update Password | Yes  |
| Delete Account  | No   |

---

# 3. User Profile Module

## Functionalities

### Update Profile

Fields:

- Full Name
- Phone
- Avatar
- Bio
- University
- Department

---

### User Preferences

Settings:

- Default Listing Expiry
- Notification Preferences
- Privacy Settings

---

## Validation Rules

Avatar:

- JPG
- PNG
- WEBP

Maximum:

- 5 MB

---

## CRUD Matrix

| Operation | User       |
| --------- | ---------- |
| Create    | System     |
| Read      | Yes        |
| Update    | Yes        |
| Delete    | Admin Only |

---

# 4. Marketplace Module

## Create Listing

Workflow:

1. User Clicks Create Listing
2. Enter Product Information
3. Upload Images
4. Select Category
5. Set Expiry Preference
6. Submit Listing
7. AI Moderation Scan
8. Moderator Queue
9. Publish Listing

---

## Listing Fields

Required:

- Title
- Description
- Price
- Category
- Condition

Optional:

- Negotiable
- Multiple Images

---

## Listing States

```text
Draft
↓
Pending Review
↓
Approved
↓
Published
↓
Sold
```

Alternative Flow

```text
Pending Review
↓
Rejected
```

---

## Allowed Actions

| Action    | Owner | Moderator | Admin |
| --------- | ----- | --------- | ----- |
| Edit      | Yes   | Yes       | Yes   |
| Delete    | Yes   | Yes       | Yes   |
| Pause     | Yes   | Yes       | Yes   |
| Mark Sold | Yes   | No        | Yes   |
| Restore   | No    | Yes       | Yes   |

---

## Listing Expiration

User Configurable

Examples:

- 7 Days
- 15 Days
- 30 Days
- 60 Days

System Process:

Expired Listing
↓
Archive
↓
Owner Notification

---

# 5. Search Module

## Search Features

Keyword Search

Filters:

- Category
- Price Range
- Condition
- Date Posted
- Seller Rating

Sorting:

- Latest
- Oldest
- Lowest Price
- Highest Price
- Most Popular

---

## Search Workflow

User Search
↓
Filter Applied
↓
Database Query
↓
Results Display

---

# 6. Favorites Module

## Functionalities

### Add Favorite

Workflow:

1. Open Listing
2. Click Favorite
3. Save Favorite

---

### Remove Favorite

Workflow:

1. Open Favorites
2. Remove Listing

---

## Edge Cases

If Listing Deleted:

- Favorite Automatically Removed

---

# 7. Messaging Module

## Communication Types

Supported:

- Text
- Images
- PDF
- Documents
- Voice Messages

---

## Conversation Workflow

Buyer
↓
Open Listing
↓
Contact Seller
↓
Chat Room Created
↓
Messages Exchanged

---

## Chat Statuses

```text
Sent
↓
Delivered
↓
Seen
```

---

## File Upload Rules

Images:

- JPG
- PNG
- WEBP

Documents:

- PDF
- DOCX

Voice:

- MP3
- WAV

Maximum Size:

20 MB

---

## Messaging Permissions

| Action       | Buyer | Seller |
| ------------ | ----- | ------ |
| Send Message | Yes   | Yes    |
| Send File    | Yes   | Yes    |
| Report User  | Yes   | Yes    |
| Block User   | Yes   | Yes    |

---

# 8. Ratings & Reviews Module

## Review Workflow

Transaction Completed
↓
User Opens Review
↓
Rating Submitted
↓
Review Published

---

## Rating Scale

1 Star
2 Star
3 Star
4 Star
5 Star

---

## Validation

One Review Per Transaction

No Anonymous Reviews

---

## Calculated Metrics

- Average Rating
- Total Reviews
- Positive Percentage

---

# 9. Reporting Module

## Report Types

### Listing Report

Reasons:

- Spam
- Scam
- Fake Product
- Offensive Content

---

### Profile Report

Reasons:

- Fake Identity
- Harassment
- Fraud

---

### Message Report

Reasons:

- Abuse
- Spam
- Threats

---

## Report States

```text
Open
↓
Under Review
↓
Resolved
```

Alternative

```text
Open
↓
Dismissed
```

---

# 10. Moderation Module

## Moderator Permissions

Can:

- Hide Listings
- Suspend Users
- Review Reports
- Review AI Flags

Cannot:

- Manage System Settings
- Manage API Providers

---

## Admin Permissions

Full Access

---

# 11. AI Moderation Module

## Moderation Flow

New Submission
↓
AI Scan
↓
Risk Score Generated
↓
Queue Assignment
↓
Moderator Decision

---

## Detection Categories

- Spam
- Duplicate Content
- Toxic Language
- Fraud Patterns

---

## Risk Levels

Low
Medium
High
Critical

---

# 12. API Key Management Module

## Roles

Admin
Moderator

---

## Functionalities

### Add API Key

Fields:

- Provider
- API Key
- Priority
- Status

---

### Rotate API Key

Automatic

Conditions:

- Rate Limit
- Quota Exceeded
- Timeout
- API Failure

---

## Rotation Workflow

```text
Key 1
↓
Failure
↓
Key 2
↓
Failure
↓
Key 3
↓
Success
```

---

## Logging Requirements

Track:

- Request Count
- Success Count
- Failure Count
- Last Used
- Daily Usage

---

# 13. Notification Module

## Notification Events

- New Message
- Listing Approved
- Listing Rejected
- Listing Sold
- New Review
- Report Updated

---

## Notification Statuses

Unread
Read
Archived

---

# 14. Role Permission Matrix

| Feature           | Guest | User | Moderator | Admin |
| ----------------- | ----- | ---- | --------- | ----- |
| Browse Listings   | Yes   | Yes  | Yes       | Yes   |
| Create Listing    | No    | Yes  | Yes       | Yes   |
| Chat              | No    | Yes  | Yes       | Yes   |
| Reviews           | No    | Yes  | Yes       | Yes   |
| Reports           | No    | Yes  | Yes       | Yes   |
| Moderate Listings | No    | No   | Yes       | Yes   |
| Manage Users      | No    | No   | Limited   | Yes   |
| Manage Categories | No    | No   | No        | Yes   |
| API Keys          | No    | No   | Yes       | Yes   |
| Analytics         | No    | No   | Limited   | Yes   |

---

# 15. Audit Trail Requirements

The system must log:

- Login Events
- Listing Creation
- Listing Updates
- Listing Deletion
- User Suspension
- Moderator Actions
- Admin Actions
- API Key Changes
- AI Decisions

Stored Information:

- User ID
- Action Type
- Timestamp
- IP Address
- Previous Value
- New Value

---

# 16. Edge Cases

### Listing Deleted During Chat

Result:

- Chat Remains Available
- Listing Shows "Removed"

---

### User Suspended

Result:

- Cannot Login
- Listings Hidden
- Chats Preserved

---

### API Provider Outage

Result:

- Auto Switch To Next Key
- Log Incident

---

### Expired Listing

Result:

- Archived
- Search Hidden
- Owner Notified

---

# End of Functional Specification Document
