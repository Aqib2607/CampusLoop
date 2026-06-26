# CampusLoop

# API Specification Document

Version: 1.0

API Version:

```text id="api001"
/api/v1
```

Architecture:

REST API

Authentication:

Laravel Sanctum

Response Format:

JSON

---

# 1. API Standards

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

## Pagination Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "last_page": 5
  }
}
```

---

# 2. Authentication APIs

---

## Register User

### Endpoint

```http
POST /auth/register
```

### Request

```json
{
  "name": "Aqib",
  "email": "aqib@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "Registration successful"
}
```

---

## Login

### Endpoint

```http
POST /auth/login
```

### Request

```json
{
  "email": "aqib@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "jwt-token",
  "user": {}
}
```

---

## Logout

### Endpoint

```http
POST /auth/logout
```

Authentication Required

---

## Current User

### Endpoint

```http
GET /auth/me
```

Authentication Required

---

# 3. User APIs

---

## User Profile

```http
GET /profile
```

---

## Update Profile

```http
PUT /profile
```

Request

```json
{
  "name": "",
  "phone": "",
  "bio": "",
  "university": "",
  "department": ""
}
```

---

## Update Avatar

```http
POST /profile/avatar
```

Multipart Form Data

---

## User Settings

```http
GET /settings
```

```http
PUT /settings
```

Request

```json
{
  "default_expiry_days": 30,
  "email_notifications": true,
  "push_notifications": true
}
```

---

# 4. Category APIs

---

## Get Categories

```http
GET /categories
```

---

## Create Category

```http
POST /admin/categories
```

Admin Only

---

## Update Category

```http
PUT /admin/categories/{id}
```

Admin Only

---

## Delete Category

```http
DELETE /admin/categories/{id}
```

Admin Only

---

# 5. Listing APIs

---

## Create Listing

```http
POST /listings
```

Authentication Required

---

### Request

```json
{
  "title": "Data Structure Book",
  "description": "Like new",
  "price": 500,
  "category_id": 1,
  "condition": "Good",
  "negotiable": true,
  "expiry_days": 30
}
```

---

## Get Listings

```http
GET /listings
```

Filters

```http
?category=
?price_min=
?price_max=
?condition=
?rating=
?sort=
```

---

## Get Single Listing

```http
GET /listings/{id}
```

---

## Update Listing

```http
PUT /listings/{id}
```

Owner/Admin

---

## Delete Listing

```http
DELETE /listings/{id}
```

Owner/Admin

---

## Pause Listing

```http
POST /listings/{id}/pause
```

---

## Mark Sold

```http
POST /listings/{id}/sold
```

---

## Renew Listing

```http
POST /listings/{id}/renew
```

---

# 6. Listing Images APIs

---

## Upload Listing Images

```http
POST /listings/{id}/images
```

Multipart Form Data

---

## Remove Listing Image

```http
DELETE /listing-images/{id}
```

---

# 7. Favorites APIs

---

## Add Favorite

```http
POST /favorites
```

Request

```json
{
  "listing_id": 10
}
```

---

## Get Favorites

```http
GET /favorites
```

---

## Remove Favorite

```http
DELETE /favorites/{listing_id}
```

---

# 8. Messaging APIs

---

## Get Conversations

```http
GET /conversations
```

---

## Start Conversation

```http
POST /conversations
```

Request

```json
{
  "listing_id": 1,
  "seller_id": 2
}
```

---

## Get Messages

```http
GET /conversations/{id}/messages
```

---

## Send Message

```http
POST /conversations/{id}/messages
```

Request

```json
{
  "message_type": "text",
  "content": "Is this available?"
}
```

---

## Upload Attachment

```http
POST /conversations/{id}/attachments
```

Supports:

- Image
- PDF
- DOCX
- Voice

---

## Block User

```http
POST /conversations/{id}/block
```

---

# 9. Review APIs

---

## Create Review

```http
POST /reviews
```

Request

```json
{
  "reviewed_user_id": 2,
  "listing_id": 4,
  "rating": 5,
  "review_text": "Excellent seller"
}
```

---

## User Reviews

```http
GET /users/{id}/reviews
```

---

## User Rating Summary

```http
GET /users/{id}/rating
```

---

# 10. Report APIs

---

## Report Listing

```http
POST /reports/listing
```

---

## Report User

```http
POST /reports/profile
```

---

## Report Message

```http
POST /reports/message
```

---

### Request

```json
{
  "target_id": 10,
  "reason": "Spam",
  "description": "Repeated advertisements"
}
```

---

## My Reports

```http
GET /reports
```

---

# 11. Notification APIs

---

## Get Notifications

```http
GET /notifications
```

---

## Mark Read

```http
POST /notifications/{id}/read
```

---

## Mark All Read

```http
POST /notifications/read-all
```

---

# 12. Moderator APIs

---

## Pending Listings

```http
GET /moderator/listings/pending
```

---

## Approve Listing

```http
POST /moderator/listings/{id}/approve
```

---

## Reject Listing

```http
POST /moderator/listings/{id}/reject
```

Request

```json
{
  "reason": "Duplicate content"
}
```

---

## Open Reports

```http
GET /moderator/reports
```

---

## Resolve Report

```http
POST /moderator/reports/{id}/resolve
```

---

## Suspend User

```http
POST /moderator/users/{id}/suspend
```

---

# 13. Admin APIs

---

## Dashboard Statistics

```http
GET /admin/dashboard
```

Returns:

```json
{
  "users": 1000,
  "listings": 5000,
  "messages": 20000,
  "reports": 100
}
```

---

## Manage Users

```http
GET /admin/users
```

```http
PUT /admin/users/{id}
```

```http
DELETE /admin/users/{id}
```

---

## Manage Moderators

```http
GET /admin/moderators
```

```http
POST /admin/moderators
```

```http
DELETE /admin/moderators/{id}
```

---

# 14. AI Provider APIs

---

## Providers List

```http
GET /admin/ai/providers
```

---

## Add Provider

```http
POST /admin/ai/providers
```

Request

```json
{
  "provider_name": "Groq"
}
```

---

## Update Provider

```http
PUT /admin/ai/providers/{id}
```

---

## Delete Provider

```http
DELETE /admin/ai/providers/{id}
```

---

# 15. API Key Management APIs

---

## Add API Key

```http
POST /admin/api-keys
```

Request

```json
{
  "provider_id": 1,
  "key_name": "Groq Key 1",
  "api_key": "encrypted-key",
  "priority": 1
}
```

---

## Get API Keys

```http
GET /admin/api-keys
```

---

## Disable API Key

```http
POST /admin/api-keys/{id}/disable
```

---

## Enable API Key

```http
POST /admin/api-keys/{id}/enable
```

---

## Delete API Key

```http
DELETE /admin/api-keys/{id}
```

---

## API Key Usage Logs

```http
GET /admin/api-keys/{id}/logs
```

---

# 16. Analytics APIs

---

## Platform Analytics

```http
GET /admin/analytics
```

---

Returns

```json
{
  "new_users": [],
  "listing_growth": [],
  "message_activity": [],
  "report_activity": []
}
```

---

# 17. Error Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 422  | Validation Error      |
| 429  | Rate Limited          |
| 500  | Internal Server Error |

---

# 18. API Versioning Strategy

Current Version

```http
/api/v1
```

Future

```http
/api/v2
```

Backward compatibility maintained whenever possible.

---

# End of API Specification Document
