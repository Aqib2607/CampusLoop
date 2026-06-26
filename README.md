# CampusLoop 🎓🔄

CampusLoop is a centralized student-focused marketplace and real-time communication platform designed for university students, teachers, and staff members to securely buy, sell, exchange, and communicate within a verified campus ecosystem.

![CampusLoop Overview](https://img.shields.io/badge/Status-Production%20Ready-success) ![Laravel](https://img.shields.io/badge/Backend-Laravel_11-red) ![React](https://img.shields.io/badge/Frontend-React_18-blue) ![Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED)

## 🚀 Key Features

- **Real-Time Marketplace:** Browse, publish, and search listings dynamically across categories (Books, Electronics, Furniture, Lab Equipment, etc.).
- **Live Communication:** Integrated WebSockets (Laravel Reverb) for real-time buyer-seller chat messaging.
- **AI-Powered Moderation:** Built-in AI moderation engine (supporting OpenAI, Gemini, Claude, Groq) with automatic API Key rotation and failover.
- **Strict Role-Based Access Control (RBAC):** Distinct permissions for Guests, Students, Teachers, Moderators, and System Administrators.
- **Advanced Reputation System:** Automated Rating/Review system enforcing community trust.
- **Production-Grade DevOps:** Multi-stage Dockerized architecture, automated GitHub Actions CI/CD, and PHPStan Level 8 static analysis.

## 🏗️ Architecture

CampusLoop is deployed as a fully decoupled monolithic application:

1. **Frontend:** React + Vite (TanStack Router, Tailwind CSS, shadcn/ui).
2. **Backend API:** Laravel 11 (PHP 8.3).
3. **Database:** MySQL 8.0.
4. **Cache/Queue/WebSockets:** Redis & Laravel Reverb.
5. **Orchestration:** Docker Compose multi-container environment.

## 🛠️ Quick Start (Docker Development)

CampusLoop includes a highly optimized Docker environment for immediate local deployment.

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aqib2607/CampusLoop.git
   cd CampusLoop
   ```

2. **Configure Environment Variables**

   ```bash
   cp backend/.env.example backend/.env
   # Ensure you set database credentials, app keys, and AI keys in backend/.env
   ```

3. **Start the Infrastructure**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

   _This command spins up MySQL, Redis, the Laravel backend, Laravel Reverb (WebSockets), the Queue worker, the Scheduler, and the React frontend._

4. **Initialize the Application**
   Run the following commands inside the backend container to install dependencies, generate the app key, and migrate the database:

   ```bash
   docker-compose -f docker-compose.dev.yml exec backend composer install
   docker-compose -f docker-compose.dev.yml exec backend php artisan key:generate
   docker-compose -f docker-compose.dev.yml exec backend php artisan migrate:fresh --seed
   ```

5. **Access the Application**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:8000

## 🛡️ CI/CD & Testing

CampusLoop enforces rigorous code quality and security standards via GitHub Actions:

- **Pest Framework:** 80%+ Backend Feature & Unit Test coverage.
- **Larastan/PHPStan:** Level 8 static analysis enforced on all backend commits.
- **Trivy & TruffleHog:** Automated container vulnerability scanning and secret leakage detection.

To run tests locally:

```bash
docker-compose -f docker-compose.dev.yml exec backend ./vendor/bin/pest
docker-compose -f docker-compose.dev.yml exec backend ./vendor/bin/phpstan analyse
```

## 📚 Documentation

Comprehensive system documentation is available in the `/docs` directory, including:

- [Requirements Architecture Document (RAD)](docs/01%20Requirements%20Architecture%20Document.md)
- [System Architecture Document](docs/07%20System%20Architecture%20Document.md)
- [Deployment & DevOps Guide](docs/12%20Deployment%20&%20DevOps%20Guide.md)
- [OpenAPI Specification](docs/11%20openapi.yaml)

## 📄 License

This project is proprietary and built specifically as an Academic Demonstration System. Unauthorized reproduction or commercial deployment is prohibited.
