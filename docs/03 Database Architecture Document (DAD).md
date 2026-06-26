# CampusLoop

## Database Architecture Document (DAD)

Version: 1.0

Project Type: Academic Demonstration System

Database Engine: MySQL 8+

ORM Layer: Laravel Eloquent

---

# 1. Database Architecture Overview

CampusLoop follows a relational database architecture optimized for:

- Marketplace Operations
- Real-Time Communication
- Moderation
- Notifications
- Ratings & Reviews
- API Key Rotation
- Audit Logging

Design Principles:

- Normalized Schema (3NF)
- Soft Deletes
- Auditability
- Horizontal Growth Readiness
- RBAC-Based Security

---

# 2. Core Entity Relationship Overview

```text
Users
│
├── Listings
│    ├── Listing Images
│    ├── Favorites
│    ├── Reports
│    ├── Reviews
│
├── Conversations
│    ├── Messages
│
├── Notifications
│
├── Ratings
│
└── User Reports

Admins
│
├── Categories
├── AI Providers
├── API Keys
├── Moderation Actions
├── Audit Logs
```

---

# 3. User Management Tables

---

## users

Stores all platform users.

| Column        | Type      |
| ------------- | --------- |
| id            | bigint    |
| role_id       | bigint    |
| name          | varchar   |
| email         | varchar   |
| password      | varchar   |
| phone         | varchar   |
| avatar        | varchar   |
| bio           | text      |
| university    | varchar   |
| department    | varchar   |
| is_verified   | boolean   |
| status        | enum      |
| last_login_at | timestamp |
| created_at    | timestamp |
| updated_at    | timestamp |
| deleted_at    | timestamp |

Indexes:

```sql
email UNIQUE
role_id INDEX
status INDEX
```

---

## roles

| Column      | Type    |
| ----------- | ------- |
| id          | bigint  |
| name        | varchar |
| description | text    |

Values:

- Student
- Teacher
- Staff
- Moderator
- Admin

---

## permissions

| Column | Type    |
| ------ | ------- |
| id     | bigint  |
| name   | varchar |
| module | varchar |

---

## role_permissions

RBAC Mapping

| Column        | Type   |
| ------------- | ------ |
| role_id       | bigint |
| permission_id | bigint |

---

# 4. User Preference Tables

---

## user_settings

| Column              | Type      |
| ------------------- | --------- |
| id                  | bigint    |
| user_id             | bigint    |
| default_expiry_days | integer   |
| email_notifications | boolean   |
| push_notifications  | boolean   |
| privacy_mode        | boolean   |
| created_at          | timestamp |
| updated_at          | timestamp |

---

# 5. Marketplace Tables

---

## categories

| Column | Type    |
| ------ | ------- |
| id     | bigint  |
| name   | varchar |
| slug   | varchar |
| icon   | varchar |
| status | boolean |

---

## listings

Core marketplace table.

| Column      | Type      |
| ----------- | --------- |
| id          | bigint    |
| user_id     | bigint    |
| category_id | bigint    |
| title       | varchar   |
| description | longtext  |
| price       | decimal   |
| condition   | enum      |
| negotiable  | boolean   |
| status      | enum      |
| expiry_date | datetime  |
| sold_at     | datetime  |
| view_count  | integer   |
| created_at  | timestamp |
| updated_at  | timestamp |
| deleted_at  | timestamp |

Status Values:

- Draft
- Pending
- Approved
- Rejected
- Published
- Paused
- Sold
- Archived

Indexes:

```sql
category_id
user_id
status
expiry_date
price
```

---

## listing_images

| Column        | Type    |
| ------------- | ------- |
| id            | bigint  |
| listing_id    | bigint  |
| image_url     | varchar |
| display_order | integer |

---

## listing_views

Analytics tracking.

| Column     | Type      |
| ---------- | --------- |
| id         | bigint    |
| listing_id | bigint    |
| viewer_id  | bigint    |
| viewed_at  | timestamp |

---

# 6. Favorites Module

---

## favorites

| Column     | Type      |
| ---------- | --------- |
| id         | bigint    |
| user_id    | bigint    |
| listing_id | bigint    |
| created_at | timestamp |

Unique Constraint:

```sql
user_id + listing_id
```

---

# 7. Messaging Architecture

---

## conversations

| Column     | Type      |
| ---------- | --------- |
| id         | bigint    |
| listing_id | bigint    |
| buyer_id   | bigint    |
| seller_id  | bigint    |
| status     | enum      |
| created_at | timestamp |

Status:

- Active
- Blocked
- Closed

---

## messages

| Column          | Type      |
| --------------- | --------- |
| id              | bigint    |
| conversation_id | bigint    |
| sender_id       | bigint    |
| message_type    | enum      |
| content         | longtext  |
| status          | enum      |
| created_at      | timestamp |

Message Types:

- Text
- Image
- PDF
- Document
- Voice

Status:

- Sent
- Delivered
- Seen

Indexes:

```sql
conversation_id
sender_id
status
```

---

## message_attachments

| Column     | Type    |
| ---------- | ------- |
| id         | bigint  |
| message_id | bigint  |
| file_url   | varchar |
| file_type  | varchar |
| file_size  | integer |

---

# 8. Ratings & Reviews

---

## reviews

| Column           | Type      |
| ---------------- | --------- |
| id               | bigint    |
| reviewer_id      | bigint    |
| reviewed_user_id | bigint    |
| listing_id       | bigint    |
| rating           | integer   |
| review_text      | text      |
| created_at       | timestamp |

Constraint:

```sql
One Review Per Transaction
```

---

## rating_summary

Precomputed metrics.

| Column              | Type    |
| ------------------- | ------- |
| user_id             | bigint  |
| average_rating      | decimal |
| review_count        | integer |
| positive_percentage | decimal |

---

# 9. Reporting System

---

## reports

| Column      | Type      |
| ----------- | --------- |
| id          | bigint    |
| reporter_id | bigint    |
| report_type | enum      |
| target_id   | bigint    |
| reason      | varchar   |
| description | text      |
| status      | enum      |
| assigned_to | bigint    |
| created_at  | timestamp |

Report Types:

- Listing
- Profile
- Message

Status:

- Open
- Under Review
- Resolved
- Dismissed

---

# 10. Moderation System

---

## moderation_actions

| Column       | Type      |
| ------------ | --------- |
| id           | bigint    |
| moderator_id | bigint    |
| target_type  | varchar   |
| target_id    | bigint    |
| action_type  | varchar   |
| notes        | text      |
| created_at   | timestamp |

Actions:

- Warning
- Hide
- Suspend
- Ban
- Approve
- Reject

---

# 11. AI Moderation Architecture

---

## ai_providers

| Column        | Type      |
| ------------- | --------- |
| id            | bigint    |
| provider_name | varchar   |
| status        | boolean   |
| created_at    | timestamp |

Examples:

- OpenAI
- Gemini
- Groq
- Claude

---

## api_keys

Centralized API key pool.

| Column         | Type      |
| -------------- | --------- |
| id             | bigint    |
| provider_id    | bigint    |
| key_name       | varchar   |
| encrypted_key  | text      |
| priority       | integer   |
| status         | boolean   |
| requests_today | integer   |
| success_count  | integer   |
| failure_count  | integer   |
| last_used_at   | datetime  |
| created_by     | bigint    |
| created_at     | timestamp |

Indexes:

```sql
provider_id
priority
status
```

---

## api_key_logs

Tracks usage.

| Column          | Type      |
| --------------- | --------- |
| id              | bigint    |
| api_key_id      | bigint    |
| request_type    | varchar   |
| response_status | varchar   |
| error_message   | text      |
| created_at      | timestamp |

---

## ai_moderation_logs

| Column        | Type      |
| ------------- | --------- |
| id            | bigint    |
| listing_id    | bigint    |
| provider_id   | bigint    |
| risk_score    | decimal   |
| result        | varchar   |
| response_data | json      |
| created_at    | timestamp |

---

# 12. Notification System

---

## notifications

| Column     | Type      |
| ---------- | --------- |
| id         | bigint    |
| user_id    | bigint    |
| type       | varchar   |
| title      | varchar   |
| message    | text      |
| status     | enum      |
| created_at | timestamp |

Status:

- Unread
- Read
- Archived

---

# 13. Analytics Tables

---

## daily_statistics

| Column          | Type    |
| --------------- | ------- |
| id              | bigint  |
| date            | date    |
| new_users       | integer |
| new_listings    | integer |
| total_messages  | integer |
| reports_created | integer |

---

# 14. Audit Logging Architecture

---

## audit_logs

Mandatory compliance table.

| Column      | Type      |
| ----------- | --------- |
| id          | bigint    |
| user_id     | bigint    |
| action_type | varchar   |
| table_name  | varchar   |
| record_id   | bigint    |
| old_values  | json      |
| new_values  | json      |
| ip_address  | varchar   |
| user_agent  | text      |
| created_at  | timestamp |

Tracked Events:

- Login
- Logout
- Create
- Update
- Delete
- Suspend
- API Key Changes
- Moderation Actions

---

# 15. Soft Delete Strategy

Enabled On:

- users
- listings
- categories
- conversations

Implementation:

```sql
deleted_at TIMESTAMP NULL
```

Benefits:

- Recovery
- Auditability
- Compliance

---

# 16. Indexing Strategy

High Priority Indexes

```sql
users(email)

users(role_id)

listings(category_id)

listings(status)

listings(expiry_date)

messages(conversation_id)

reports(status)

notifications(user_id)

api_keys(provider_id)
```

Composite Indexes

```sql
listings(category_id,status)

messages(conversation_id,status)

reviews(reviewed_user_id,rating)

reports(report_type,status)
```

---

# 17. Partitioning & Scalability Strategy

Future Scale Threshold:

10,000+ Users

---

Messages Table

Partition By:

```sql
created_at
```

Monthly partitions.

---

Audit Logs

Partition By:

```sql
created_at
```

Monthly partitions.

---

Notification Table

Archive older records.

---

# 18. Data Retention Policy

Messages

Retention:

3 Years

---

Audit Logs

Retention:

5 Years

---

Notifications

Retention:

1 Year

---

AI Logs

Retention:

2 Years

---

Reports

Retention:

5 Years

---

# 19. Backup Strategy

Daily:

Incremental Backup

Weekly:

Full Backup

Monthly:

Archive Snapshot

Storage:

Encrypted Backup Storage

---

# 20. Database Security Requirements

Mandatory:

- Encrypted API Keys
- Password Hashing
- RBAC Enforcement
- Prepared Statements
- Query Validation
- File Upload Validation

---

# End of Database Architecture Document
