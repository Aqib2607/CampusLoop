# CampusLoop

# System Architecture Document (SAD)

Version: 1.0

Project Type: Academic Demonstration Platform

Architecture Style:
Modular Monolithic Architecture

---

# 1. Architecture Overview

CampusLoop follows a layered architecture designed to separate:

* Presentation Layer
* Business Logic Layer
* Data Layer
* Integration Layer
* AI Services Layer

Objectives:

* Maintainability
* Scalability
* Security
* Clear Separation of Concerns

---

# 2. High-Level Architecture

```text
┌──────────────────────────────┐
│         React Client         │
│  (Student / Staff / Admin)   │
└──────────────┬───────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────┐
│      Laravel REST API        │
│ Authentication & Services    │
└──────┬────────┬──────────────┘
       │        │
       │        │
       ▼        ▼

┌──────────┐   ┌──────────────┐
│  MySQL   │   │ Socket Layer │
│ Database │   │ Real-Time    │
└──────────┘   └──────────────┘

       │
       ▼

┌──────────────────────────────┐
│ AI Provider Management Layer │
│ OpenAI / Gemini / Groq etc.  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ API Key Rotation Service     │
└──────────────────────────────┘

       │
       ▼

┌──────────────────────────────┐
│ Cloudinary Media Storage     │
└──────────────────────────────┘
```

---

# 3. Frontend Architecture

Framework:

* React
* TypeScript
* Vite

Architecture Pattern:

```text
Pages
 ↓
Features
 ↓
Components
 ↓
Services
 ↓
API Layer
```

---

## Frontend Modules

### Public

* Home
* Browse Listings
* Login
* Register

### Marketplace

* Listings
* Search
* Favorites

### Communication

* Chat
* Notifications

### User

* Dashboard
* Reviews
* Settings

### Administration

* Users
* Reports
* Categories
* Analytics
* API Keys

---

# 4. Backend Architecture

Framework:

Laravel

Pattern:

```text
Controller
 ↓
Service
 ↓
Repository
 ↓
Model
 ↓
Database
```

---

## Backend Modules

### Authentication Module

Responsibilities:

* Login
* Registration
* Permissions

---

### User Module

Responsibilities:

* Profiles
* Settings

---

### Marketplace Module

Responsibilities:

* Listings
* Categories
* Favorites

---

### Messaging Module

Responsibilities:

* Conversations
* Attachments

---

### Moderation Module

Responsibilities:

* Reports
* Reviews
* Suspensions

---

### AI Module

Responsibilities:

* Content Analysis
* API Rotation
* Provider Routing

---

# 5. Service Architecture

## Core Services

```text
AuthService

UserService

ListingService

CategoryService

FavoriteService

ChatService

ReviewService

NotificationService

ModerationService

AIProviderService

ApiRotationService
```

---

# 6. AI Architecture

Purpose:

Content moderation and future AI enhancements.

---

## AI Processing Flow

```text
User Creates Listing
        ↓
AI Service Called
        ↓
Provider Selected
        ↓
Content Analysis
        ↓
Risk Score Generated
        ↓
Moderator Queue
```

---

# 7. API Key Rotation Architecture

Purpose:

Maintain continuous AI service availability.

---

## Key Pool Structure

```text
Provider
   ↓
Multiple Keys
   ↓
Priority Ordering
```

Example:

```text
Groq
├── Key 1
├── Key 2
└── Key 3
```

---

## Rotation Flow

```text
Request
 ↓
Primary Key
 ↓
Rate Limited?
 ↓
Yes
 ↓
Next Active Key
 ↓
Success
```

---

# 8. Messaging Architecture

Real-Time Layer:

Socket.IO

---

## Message Flow

```text
Buyer
 ↓
Socket Event
 ↓
Server
 ↓
Seller
```

---

## Offline Flow

```text
Message Saved
 ↓
Database
 ↓
Recipient Returns
 ↓
Messages Loaded
```

---

# 9. Notification Architecture

Notification Sources:

* Chat
* Reviews
* Moderation
* Listings

---

## Flow

```text
Event
 ↓
Notification Service
 ↓
Database
 ↓
Frontend
```

---

# 10. Media Architecture

Storage Provider:

Cloudinary

---

## Upload Flow

```text
User Upload
 ↓
Validation
 ↓
Cloudinary
 ↓
URL Stored
 ↓
Listing Created
```

---

# 11. Analytics Architecture

Metrics:

* Users
* Listings
* Messages
* Reports

---

## Collection Flow

```text
Action
 ↓
Event
 ↓
Statistics Service
 ↓
Analytics Tables
```

---

# 12. Security Boundaries

Protected Areas:

* Dashboard
* Chat
* Reviews
* Administration

---

Public Areas:

* Homepage
* Browse Listings
* Listing Details

---

# 13. Scalability Strategy

Current Target:

* 10,000 Users
* 20,000 Listings

---

Future Scaling:

### Database

* Read Replicas

### Search

* Meilisearch

### Queue

* Redis

### CDN

* Cloudinary CDN

---

# 14. Failure Recovery Strategy

### AI Failure

Fallback:

Provider Switch

---

### Socket Failure

Fallback:

Database Messaging

---

### Cloudinary Failure

Fallback:

Retry Queue

---

# 15. Deployment Architecture

```text
React
 ↓
Vercel

Laravel
 ↓
Render

MySQL
 ↓
Railway

Cloudinary
 ↓
External Service
```

---

# 16. Architecture Principles

The system must:

* Remain modular
* Be role-driven
* Support future multi-university expansion
* Support future AI features
* Maintain low operational complexity

---

# End of System Architecture Document
