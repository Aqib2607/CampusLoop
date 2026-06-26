# CampusLoop

# Security Architecture Document (SAD)

Version: 1.0

Security Classification:
Medium-Risk Web Application

Project Type:
Student Marketplace & Real-Time Communication Platform

---

# 1. Security Objectives

CampusLoop must protect:

- User Accounts
- User Conversations
- User Uploaded Files
- AI Provider Credentials
- Administrative Functions
- System Integrity

Primary Goals:

- Confidentiality
- Integrity
- Availability
- Accountability

---

# 2. Security Architecture Overview

```text
User
 ↓
Frontend Validation
 ↓
HTTPS
 ↓
Laravel API Gateway
 ↓
Authentication Layer
 ↓
Authorization Layer
 ↓
Business Logic Layer
 ↓
Database Layer
```

Cross-Cutting Security Services:

```text
Authentication

Authorization

Rate Limiting

Audit Logging

Input Validation

Encryption

Monitoring
```

---

# 3. Authentication Architecture

Technology:

```text
Laravel Sanctum
```

---

## Login Flow

```text
User Login
 ↓
Credential Validation
 ↓
Password Verification
 ↓
Token Generation
 ↓
Authenticated Session
```

---

## Authentication Features

Required:

- Login
- Logout
- Session Validation
- Token Revocation

Future:

- Two-Factor Authentication
- Google Login
- University Login

---

# 4. Password Security

Storage Method:

```text
bcrypt
```

Laravel Default Hashing.

---

## Password Rules

Minimum:

```text
8 Characters
```

Required:

- Uppercase
- Lowercase
- Number

Recommended:

- Special Character

---

## Password Reset

Token-Based

Expiry:

```text
60 Minutes
```

---

# 5. Authorization Architecture

Model:

```text
RBAC
(Role-Based Access Control)
```

Package:

```text
spatie/laravel-permission
```

---

# 6. User Roles

Roles:

```text
Guest

Student

Teacher

Staff

Moderator

Admin
```

---

## Authorization Flow

```text
Authenticated User
 ↓
Role Check
 ↓
Permission Check
 ↓
Resource Access
```

---

# 7. Protected Resources

Admin Only:

- User Management
- Moderator Management
- Category Management
- Analytics

---

Moderator:

- Reports
- Listing Reviews
- User Suspension

---

User:

- Own Listings
- Own Reviews
- Own Settings

---

# 8. API Security

All APIs Protected By:

- Authentication Middleware
- Authorization Middleware
- Validation Layer

---

## API Standards

Protected Endpoints:

```http
/profile

/listings

/favorites

/messages

/reviews
```

---

## Request Validation

All requests must pass:

```text
Input Validation

Type Validation

Length Validation

File Validation
```

---

# 9. Rate Limiting Strategy

Technology:

Laravel Rate Limiter

---

## Public Routes

```text
60 Requests / Minute
```

---

## Authenticated Routes

```text
120 Requests / Minute
```

---

## Authentication Routes

```text
5 Login Attempts
```

Lock Duration:

```text
15 Minutes
```

---

# 10. Input Validation Security

Every Input Must Validate:

- Required Fields
- Data Types
- Length
- Allowed Values

---

## Example

Listing Title

Minimum:

```text
3 Characters
```

Maximum:

```text
255 Characters
```

---

# 11. SQL Injection Protection

Protection Method:

Laravel Eloquent ORM

---

Rules:

Never Use:

```php
Raw SQL Queries
```

Without Binding Parameters.

---

Allowed:

```php
Eloquent Queries

Query Builder
```

---

# 12. XSS Protection

Protection Methods:

- Output Escaping
- Blade Escaping
- React Sanitization

---

User Inputs Sanitized:

- Messages
- Reviews
- Listing Descriptions
- Reports

---

Blocked:

```html
<script>
```

Tags

Embedded Scripts

Injected HTML

---

# 13. CSRF Protection

Technology:

Laravel CSRF Middleware

---

Protected:

- Form Submission
- Profile Updates
- Listing Updates
- Administrative Actions

---

# 14. File Upload Security

Supported Files:

Images:

```text
jpg

png

webp
```

---

Documents:

```text
pdf

docx
```

---

Voice Files:

```text
wav

mp3
```

---

## Upload Validation

Check:

- MIME Type
- Extension
- File Size

---

Maximum Size:

```text
20MB
```

---

## Dangerous File Types Blocked

```text
exe

bat

cmd

js

php

sh
```

---

# 15. Cloudinary Security

Storage Strategy:

```text
Upload
 ↓
Validation
 ↓
Cloudinary
 ↓
Store URL Only
```

---

Rules:

- No Local File Storage
- No Executable Uploads
- Signed Upload Requests

---

# 16. AI API Key Security

Critical System Component

---

Storage Rules

Never Store:

```text
Plain Text API Keys
```

---

Required:

```text
Encrypted Storage
```

Laravel Encryption:

```php
Crypt::encryptString()
```

---

# 17. API Key Access Control

Who Can View:

```text
Admin
```

Only

---

Who Can Create:

```text
Admin

Moderator
```

---

Who Can Delete:

```text
Admin
```

Only

---

# 18. API Rotation Security

Provider Failure Handling

```text
Rate Limit
 ↓
Disable Current Key
 ↓
Use Next Key
 ↓
Log Event
```

---

Every Rotation Logged.

---

# 19. Audit Logging Architecture

All Critical Actions Logged.

---

Events:

- Login
- Logout
- Listing Creation
- Listing Deletion
- User Suspension
- Report Resolution
- API Key Changes

---

Stored Data

```text
User ID

Timestamp

IP Address

Action

Old Data

New Data
```

---

# 20. Messaging Security

Chat Permissions:

Only Participants Can Access Conversations.

---

Validation:

```text
Conversation Ownership Check
```

Before Loading Messages.

---

Attachments Scanned Before Storage.

---

# 21. Moderation Security

Moderators Cannot:

- Manage API Providers
- Access Settings
- Change Roles

---

Admins Can Override Moderator Actions.

---

# 22. Security Headers

Recommended Headers

```text
Content-Security-Policy

X-Frame-Options

X-Content-Type-Options

Referrer-Policy

Permissions-Policy
```

---

# 23. OWASP Top 10 Protection

Protected Against:

### A01

Broken Access Control

Solution:

RBAC

---

### A02

Cryptographic Failures

Solution:

Encryption

---

### A03

Injection

Solution:

ORM + Validation

---

### A04

Insecure Design

Solution:

Architecture Review

---

### A05

Security Misconfiguration

Solution:

Environment Isolation

---

### A06

Vulnerable Components

Solution:

Dependency Audits

---

### A07

Authentication Failures

Solution:

Sanctum + Rate Limiting

---

### A08

Integrity Failures

Solution:

Signed Deployments

---

### A09

Logging Failures

Solution:

Audit Logging

---

### A10

SSRF

Solution:

URL Validation

---

# 24. Incident Response Plan

Severity Levels

### Low

Minor Errors

---

### Medium

Unauthorized Access Attempts

---

### High

Data Exposure Risk

---

### Critical

Database Breach

API Key Leakage

Admin Compromise

---

## Response Flow

```text
Detect
 ↓
Contain
 ↓
Investigate
 ↓
Recover
 ↓
Report
```

---

# 25. Backup & Recovery Security

Database Backups

Daily:

Incremental

Weekly:

Full Backup

---

Retention:

```text
30 Days
```

---

Backups Must Be:

- Encrypted
- Access Controlled

---

# 26. Security Acceptance Criteria

The system is considered secure when:

✓ Passwords are hashed

✓ API keys are encrypted

✓ RBAC is enforced

✓ File uploads are validated

✓ Audit logs are generated

✓ Rate limiting is active

✓ Chat ownership validation works

✓ Admin routes are protected

✓ OWASP protections are implemented

✓ Backup strategy is operational

---

# End of Security Architecture Document
