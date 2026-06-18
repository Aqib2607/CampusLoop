# CampusLoop

# Technology Stack Document (TSD)

Version: 1.0

Project Type: Academic Demonstration Platform

Architecture Style:
Monolithic Backend + SPA Frontend + Real-Time Communication Layer

---

# 1. Technology Strategy

CampusLoop is designed as a modern full-stack web application using:

* React Frontend
* Laravel Backend
* MySQL Database
* Socket.IO Real-Time Layer
* Cloudinary Media Storage

Architecture Priorities:

* Simplicity
* Scalability
* Maintainability
* Academic Demonstration Readiness

---

# 2. Frontend Technology Stack

## Core Framework

### React

Version:

```text
React 19+
```

Purpose:

* Component-based UI
* SPA Architecture
* Fast Rendering

---

### TypeScript

Purpose:

* Type Safety
* Better Maintainability
* Reduced Runtime Errors

---

### Vite

Purpose:

* Fast Development
* Optimized Production Build

---

# 3. Frontend UI Stack

## Tailwind CSS

Purpose:

* Utility-First Styling
* Responsive Design
* Faster UI Development

---

## ShadCN UI

Purpose:

* Modern Components
* Accessibility
* Consistency

---

## Lucide React

Purpose:

* Icons
* Lightweight Assets

---

## Framer Motion

Purpose:

* UI Animations
* Page Transitions
* Interactive Effects

---

# 4. Frontend State Management

## Zustand

Purpose:

* Lightweight Global State
* Authentication State
* Notification State
* User State

Stores:

```text
authStore
userStore
chatStore
notificationStore
listingStore
```

---

# 5. Frontend Routing

## React Router

Purpose:

* Route Management
* Protected Routes
* Lazy Loading

---

# 6. API Communication Layer

## Axios

Purpose:

* REST API Requests
* Authentication Requests
* Error Handling

Configuration:

```text
/api
```

Base Service Layer

```text
services/
```

Structure

```text
services/
├── auth.service.ts
├── listing.service.ts
├── chat.service.ts
├── notification.service.ts
└── admin.service.ts
```

---

# 7. Backend Technology Stack

## Laravel

Version:

```text
Laravel 12+
```

Purpose:

* REST API Development
* Authentication
* Business Logic

---

## PHP

Version:

```text
PHP 8.3+
```

---

# 8. Authentication Stack

## Laravel Sanctum

Purpose:

* API Authentication
* Token Management

Features:

* Login
* Logout
* Token Revocation

---

## Role-Based Access Control

Package:

```text
spatie/laravel-permission
```

Purpose:

* Roles
* Permissions
* Middleware Protection

---

# 9. Database Stack

## MySQL

Version:

```text
MySQL 8+
```

Purpose:

* Relational Data
* Marketplace Records
* Messaging Records

---

## Laravel Migrations

Purpose:

* Version-Controlled Schema

---

## Laravel Seeders

Purpose:

* Initial Data

Examples:

* Roles
* Categories
* Permissions

---

# 10. Real-Time Communication Stack

## Socket.IO

Purpose:

* Live Messaging
* Real-Time Notifications

---

### Laravel Broadcasting

Purpose:

* Event Dispatching

---

### Redis

Future Enhancement

Purpose:

* Message Queue
* Socket Scaling

MVP:

Not Required

---

# 11. Media Management Stack

## Cloudinary

Purpose:

* Image Storage
* Image Optimization
* CDN Delivery

Supported:

* JPG
* PNG
* WEBP

---

## Laravel Storage Layer

Purpose:

* Upload Management
* Media Validation

---

# 12. AI Moderation Architecture

## AI Provider Layer

Supported Providers

```text
OpenAI
Gemini
Groq
Claude
```

---

## AI Service Architecture

```text
AI Request
↓
Provider Manager
↓
Key Rotation Service
↓
Active Provider
↓
Response
```

---

# 13. API Key Rotation Architecture

Purpose:

Automatic failover when API limits are reached.

---

## Rotation Flow

```text
Key 1
↓
Quota Exceeded
↓
Disable Temporarily
↓
Switch To Key 2
↓
Continue
```

---

## Backend Service Structure

```text
app/
└── Services/
     ├── AI/
     │    ├── ProviderManager.php
     │    ├── ApiKeyRotationService.php
     │    ├── GroqProvider.php
     │    ├── GeminiProvider.php
     │    ├── OpenAIProvider.php
     │    └── ClaudeProvider.php
```

---

## Rotation Rules

Triggers:

* Rate Limit
* Quota Exceeded
* Timeout
* Invalid Response
* Provider Outage

---

## Logging Requirements

Track:

* Successes
* Failures
* Last Used
* Daily Usage
* Error Codes

---

# 14. Search Architecture

## Database Search

MVP:

```text
MySQL Full-Text Search
```

---

Future:

```text
Meilisearch
```

or

```text
Elasticsearch
```

---

# 15. Notification Architecture

## In-App Notifications

Laravel Events

Laravel Listeners

Database Notifications

---

Future:

Push Notifications

---

# 16. Security Stack

Authentication

```text
Laravel Sanctum
```

---

Authorization

```text
Spatie Permission
```

---

Validation

```text
Laravel Form Requests
```

---

Security Features

* CSRF Protection
* XSS Protection
* SQL Injection Prevention
* Rate Limiting
* Password Hashing

---

Password Algorithm

```text
Bcrypt
```

---

# 17. Backend Folder Structure

```text
backend/
│
├── app/
│   ├── Http/
│   ├── Models/
│   ├── Services/
│   ├── Repositories/
│   ├── Events/
│   ├── Listeners/
│   └── Policies/
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
│
├── routes/
│
├── storage/
│
└── tests/
```

---

# 18. Frontend Folder Structure

```text
frontend/
│
├── src/
│   ├── pages/
│   ├── layouts/
│   ├── routes/
│   ├── services/
│   ├── stores/
│   ├── hooks/
│   ├── components/
│   ├── features/
│   ├── utils/
│   └── assets/
│
├── public/
│
└── dist/
```

---

# 19. API Architecture

Style:

```text
REST API
```

Versioning:

```text
/api/v1
```

---

Examples

```text
POST   /auth/login

POST   /auth/register

GET    /listings

POST   /listings

GET    /listings/{id}

PUT    /listings/{id}

DELETE /listings/{id}

POST   /favorites

GET    /messages

POST   /reports

POST   /reviews
```

---

# 20. Testing Stack

Frontend

```text
Vitest
React Testing Library
```

---

Backend

```text
PHPUnit
Laravel Test Suite
```

---

API Testing

```text
Postman
```

---

# 21. Deployment Architecture

## Frontend Hosting

Recommended:

[Vercel](https://vercel.com?utm_source=chatgpt.com)

Benefits:

* Free Tier
* Fast CDN
* Easy GitHub Integration

---

## Backend Hosting

Recommended:

[Render](https://render.com?utm_source=chatgpt.com)

Benefits:

* Laravel Support
* Managed Deployment

---

## Database Hosting

Recommended:

[Railway](https://railway.com?utm_source=chatgpt.com)

Alternative:

MySQL on Render

---

# 22. Environment Variables

Backend

```env
APP_NAME=CampusLoop

APP_ENV=production

APP_URL=

DB_CONNECTION=mysql
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

AI_PROVIDER=

SOCKET_URL=

MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
```

---

Frontend

```env
VITE_API_URL=

VITE_SOCKET_URL=
```

---

# 23. Third-Party Integrations

Required

* Cloudinary
* Socket.IO

Optional

* OpenAI
* Gemini
* Groq
* Claude

Future

* Firebase Push Notifications
* Google OAuth

---

# 24. Performance Optimization

Frontend

* Route Lazy Loading
* Component Splitting
* Image Optimization

Backend

* Database Indexing
* Eager Loading
* Query Optimization

Media

* Cloudinary Compression
* CDN Delivery

---

# 25. Cost Analysis

Academic MVP

Frontend:

* Vercel Free

Backend:

* Render Free

Database:

* Railway Free Trial

Cloudinary:

* Free Tier

Estimated Cost:

```text
$0 – $10/month
```

---

Growth Stage

Expected Cost

```text
$20 – $100/month
```

Depending on:

* Traffic
* Storage
* AI Usage

---

# 26. Production Readiness Checklist

✓ Authentication

✓ Role Management

✓ Marketplace

✓ Messaging

✓ Reviews

✓ Reporting

✓ Notifications

✓ AI Moderation

✓ API Key Rotation

✓ Analytics

✓ Responsive UI

✓ Secure Deployment

---

# 27. Final Technology Recommendation

Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* ShadCN UI
* Zustand
* Framer Motion

Backend

* Laravel
* PHP 8.3
* Sanctum
* Spatie Permission

Database

* MySQL

Storage

* Cloudinary

Real-Time

* Socket.IO

Hosting

* Vercel
* Render
* Railway

AI Layer

* Multi-Provider Architecture
* Automatic API Key Rotation

---

# End of Technology Stack Document
