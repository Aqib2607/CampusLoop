# CampusLoop

# Role Permission Matrix

Version: 1.0

Authorization Model:
RBAC (Role-Based Access Control)

Roles:

1. Guest
2. Student
3. Teacher
4. Staff
5. Moderator
6. Admin

---

# 1. Role Hierarchy

```text id="f7q2mr"
Guest

↓

Student / Teacher / Staff

↓

Moderator

↓

Admin
```

---

# 2. Authentication Permissions

| Permission         | Guest | Student | Teacher | Staff | Moderator | Admin |
| ------------------ | ----- | ------- | ------- | ----- | --------- | ----- |
| Register           | ✓     | ✗       | ✗       | ✗     | ✗         | ✗     |
| Login              | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Logout             | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Forgot Password    | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Reset Password     | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Own Profile   | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Update Own Profile | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |

---

# 3. Marketplace Permissions

| Permission            | Guest | Student | Teacher | Staff | Moderator | Admin |
| --------------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| Browse Listings       | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Search Listings       | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Listing Details  | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Create Listing        | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Edit Own Listing      | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Delete Own Listing    | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Pause Own Listing     | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Renew Own Listing     | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Mark Own Listing Sold | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Upload Listing Images | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Own Listings     | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |

---

# 4. Search Permissions

| Permission     | Guest | Student | Teacher | Staff | Moderator | Admin |
| -------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| Keyword Search | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Filter Search  | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Sort Listings  | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |

---

# 5. Favorites Permissions

| Permission      | Guest | Student | Teacher | Staff | Moderator | Admin |
| --------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| Add Favorite    | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Remove Favorite | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Favorites  | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |

---

# 6. Messaging Permissions

| Permission              | Guest | Student | Teacher | Staff | Moderator | Admin |
| ----------------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| Start Conversation      | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Send Text Message       | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Send Images             | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Send Documents          | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Send PDFs               | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Send Voice Messages     | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Own Conversations  | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Delete Own Conversation | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Block User              | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Report User             | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |

---

# 7. Review & Rating Permissions

| Permission          | Guest | Student | Teacher | Staff | Moderator | Admin |
| ------------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| Submit Review       | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Submit Rating       | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Reviews        | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Rating Summary | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Delete Own Review   | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |

---

# 8. Reporting Permissions

| Permission       | Guest | Student | Teacher | Staff | Moderator | Admin |
| ---------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| Report Listing   | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Report Profile   | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Report Message   | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Own Reports | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |

---

# 9. Notification Permissions

| Permission             | Guest | Student | Teacher | Staff | Moderator | Admin |
| ---------------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| View Notifications     | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Mark Notification Read | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Clear Notifications    | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |

---

# 10. Moderator Permissions

| Permission               | Guest | Student | Teacher | Staff | Moderator | Admin |
| ------------------------ | ----- | ------- | ------- | ----- | --------- | ----- |
| View Pending Listings    | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Approve Listing          | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Reject Listing           | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| View Reports Queue       | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Resolve Reports          | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Hide Listing             | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Suspend User             | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Ban User                 | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| View AI Moderation Queue | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |

---

# 11. User Management Permissions

| Permission    | Guest | Student | Teacher | Staff | Moderator | Admin |
| ------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| View Users    | ✗     | ✗       | ✗       | ✗     | Limited   | ✓     |
| Suspend Users | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Restore Users | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Delete Users  | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| Change Roles  | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |

---

# 12. Category Management Permissions

| Permission        | Guest | Student | Teacher | Staff | Moderator | Admin |
| ----------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| View Categories   | ✓     | ✓       | ✓       | ✓     | ✓         | ✓     |
| Create Categories | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| Update Categories | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| Delete Categories | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |

---

# 13. Analytics Permissions

| Permission                 | Guest | Student | Teacher | Staff | Moderator | Admin |
| -------------------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| View Own Statistics        | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Moderation Statistics | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| View Platform Analytics    | ✗     | ✗       | ✗       | ✗     | Limited   | ✓     |

---

# 14. AI Provider Permissions

| Permission         | Guest | Student | Teacher | Staff | Moderator | Admin |
| ------------------ | ----- | ------- | ------- | ----- | --------- | ----- |
| View AI Providers  | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Create AI Provider | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| Update AI Provider | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| Delete AI Provider | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |

---

# 15. API Key Management Permissions

| Permission       | Guest | Student | Teacher | Staff | Moderator | Admin |
| ---------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| View API Keys    | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Create API Keys  | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Disable API Keys | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Enable API Keys  | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| View Usage Logs  | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| Delete API Keys  | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |

---

# 16. Audit Log Permissions

| Permission             | Guest | Student | Teacher | Staff | Moderator | Admin |
| ---------------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| View Own Activity      | ✗     | ✓       | ✓       | ✓     | ✓         | ✓     |
| View Moderation Logs   | ✗     | ✗       | ✗       | ✗     | ✓         | ✓     |
| View System Audit Logs | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |

---

# 17. Administrative Permissions

| Permission                  | Guest | Student | Teacher | Staff | Moderator | Admin |
| --------------------------- | ----- | ------- | ------- | ----- | --------- | ----- |
| Access Admin Dashboard      | ✗     | ✗       | ✗       | ✗     | Limited   | ✓     |
| Manage Moderators           | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| Manage Platform Settings    | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| Manage Security Settings    | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |
| Manage System Configuration | ✗     | ✗       | ✗       | ✗     | ✗         | ✓     |

---

# 18. Special Business Rules

## Rule 1

Users may only edit their own listings.

Exception:

* Moderator
* Admin

---

## Rule 2

Users may only access conversations they participate in.

---

## Rule 3

Only Admin can permanently delete:

* Users
* Categories
* AI Providers

---

## Rule 4

Moderators may create API keys but may not delete them.

---

## Rule 5

Only Admin may assign Moderator roles.

---

## Rule 6

Only Admin may modify system-wide settings.

---

# 19. Permission Naming Convention

Recommended Laravel Permissions:

```text id="perm001"
listing.create
listing.update
listing.delete
listing.approve

user.view
user.suspend
user.restore
user.delete

report.view
report.resolve

review.create
review.delete

api-key.create
api-key.view
api-key.disable
api-key.delete

analytics.view

settings.manage
```

---

# 20. Role Acceptance Criteria

A role implementation is accepted when:

✓ Unauthorized users cannot access protected resources

✓ RBAC middleware protects all routes

✓ Moderator permissions are restricted

✓ API key permissions follow business rules

✓ Admin has full platform control

✓ Conversation ownership checks are enforced

✓ Listing ownership checks are enforced

---

# End of Role Permission Matrix
