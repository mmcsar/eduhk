# 🚛 TMSA - Africa Transport Hub

**Enterprise-grade transport and logistics platform transforming the African corridor**

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D8.0.0-orange)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)

---

## 🌍 Vision

TMSA is the leading digital platform connecting **mines**, **brokers**, **transporters**, and **drivers** across the African corridor. From Lubumbashi to Dar es Salaam, from Kolwezi to Lobito — we're revolutionizing cross-border transport with:

- **Real-time GPS tracking** across borders
- **Smart marketplace** connecting cargo ↔ trucks (TruckStop style)
- **Secure payments** (CinetPay, Stripe, Mobile Money)
- **Digital documentation** (BL, PoD, Customs)
- **Multi-language support** (FR, EN, SW, PT)

---

## 🏗️ Architecture Overview

### Monorepo Structure

```
tmsa/
├── apps/
│   ├── web/                   # Next.js 15 - Dashboard + Marketplace + Admin
│   ├── mobile/                # React Native (Expo) - Driver App
│   └── admin/                 # Future: Desktop Admin App
│
├── services/                  # Microservices Backend (NestJS)
│   ├── api-gateway/           # Central API Gateway (Reverse Proxy)
│   ├── auth-service/          # Auth + JWT + RBAC + OAuth
│   ├── tracking-service/      # WebSocket + GPS + Redis Adapter
│   ├── mission-service/       # Missions + Corridors + Checkpoints + QR
│   ├── payment-service/       # CinetPay + Stripe + Wallet + HMAC
│   ├── marketplace-service/   # Cargo ↔ Truck Matching
│   ├── file-service/          # S3/Cloudinary Document Upload
│   └── notification-service/  # Push + SMS + Email (Twilio/Firebase)
│
├── libs/                      # Shared Libraries
│   ├── types/                 # TypeScript Types & Interfaces
│   ├── utils/                 # Crypto, Validation, Formatters, Geo
│   ├── configs/               # Environment Variables
│   └── sdk/                   # Client SDK for Web + Mobile
│
├── infra/                     # Infrastructure as Code
│   ├── docker/                # Docker Compose + Dockerfiles
│   ├── kubernetes/            # K8s Deployments + Services + HPA
│   ├── terraform/             # AWS/GCP/Azure Infrastructure
│   └── monitoring/            # Grafana + Prometheus + Loki
│
└── locales/                   # i18n Translations (FR, EN, SW, PT)
```

### Technology Stack

#### **Frontend**
- **Web**: Next.js 15 (App Router), TailwindCSS, shadcn/ui, Zustand, React Query
- **Mobile**: React Native (Expo 50), Expo Router, React Native Maps, Socket.io

#### **Backend**
- **Framework**: NestJS 10 (TypeScript)
- **Databases**: MongoDB (missions, users), PostgreSQL (analytics), Redis (cache, WebSocket)
- **Message Queue**: Kafka (event streaming)
- **Search**: Elasticsearch (logs, marketplace search)

#### **Infrastructure**
- **Container**: Docker + Docker Compose
- **Orchestration**: Kubernetes (EKS, GKE, AKS)
- **IaC**: Terraform
- **Monitoring**: Prometheus, Grafana, Kibana
- **CI/CD**: GitHub Actions, ArgoCD

#### **Integrations**
- **Payments**: CinetPay (Africa), Stripe (International)
- **Storage**: AWS S3, Cloudinary
- **Notifications**: Twilio (SMS), SendGrid (Email), Firebase (Push)
- **Maps**: Mapbox, Google Maps

---

## 🚀 Quick Start

### Prerequisites

```bash
- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- (Optional) Kubernetes cluster
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/tmsa/monorepo.git
cd tmsa
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

4. **Start infrastructure (Docker)**

```bash
pnpm docker:up
# This starts: MongoDB, Redis, PostgreSQL, Kafka, Prometheus, Grafana
```

5. **Start development servers**

```bash
# Terminal 1 - Web App
cd apps/web
pnpm dev
# http://localhost:3000

# Terminal 2 - Mobile App
cd apps/mobile
pnpm start
# Expo DevTools opens

# Terminal 3 - API Gateway
cd services/api-gateway
pnpm dev
# http://localhost:8080

# Terminal 4 - Auth Service
cd services/auth-service
pnpm dev
# http://localhost:3001

# Terminal 5 - Tracking Service
cd services/tracking-service
pnpm dev
# http://localhost:3003
```

### Using Turbo (Recommended)

```bash
# Start all services in parallel
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint all code
pnpm lint
```

---

## 📱 Applications

### Web Dashboard (`apps/web`)

**URL**: http://localhost:3000

**Features**:
- 🌍 Multi-language (FR, EN, SW, PT)
- 📊 Real-time analytics dashboard
- 🗺️ Live tracking map (Mapbox/Google Maps)
- 🚛 Mission management (create, assign, track, complete)
- 🛒 Marketplace (cargo ↔ truck matching)
- 💳 Payment management (wallet, transactions)
- 📄 Document management (upload BL, PoD)
- 👥 Team & vehicle management

**Roles**:
- Mine Operator (create missions)
- Broker (marketplace, quotes)
- Admin (MMC control center)
- Financial Officer (payments, reports)

### Mobile App (`apps/mobile`)

**Platform**: iOS + Android (React Native Expo)

**Features**:
- 📍 GPS background tracking (30s intervals)
- 📷 QR code scanner (checkpoint validation)
- 📸 Document upload (BL, PoD, photos)
- 🔔 Push notifications (mission updates)
- 🗺️ Offline maps support
- 🌐 Multi-language

**Target Users**: Drivers, Field Agents

---

## 🔧 Microservices

### API Gateway (`:8080`)

Central entry point. Features:
- Reverse proxy to all microservices
- JWT authentication guard
- Rate limiting (100 req/min)
- API documentation (Swagger)
- Request logging & monitoring

### Auth Service (`:3001`)

Authentication & Authorization:
- User registration & login
- JWT token generation & rotation
- Role-based access control (RBAC)
- OAuth integration (Google, Facebook)
- Password reset, email verification

### Tracking Service (`:3003`)

Real-time GPS tracking:
- WebSocket server (Socket.io)
- Redis adapter for horizontal scaling
- Position history storage
- Geofencing & corridor validation
- ETA calculation

### Payment Service (`:3004`)

Payment processing:
- CinetPay integration (Mobile Money Africa)
- Stripe integration (cards, international)
- Wallet system (deposit, withdraw)
- HMAC webhook verification
- Transaction history & receipts

### Mission Service (`:3002`)

Mission lifecycle management:
- Mission CRUD operations
- Checkpoint management
- QR code generation
- Document attachment
- Status workflow

### Marketplace Service (`:3005`)

Cargo ↔ Truck matching:
- Listing creation (cargo/truck)
- Smart search & filtering
- Interest management
- Automated matching algorithm
- Pricing negotiation

---

## 🐳 Docker Deployment

### Development

```bash
docker-compose -f infra/docker/docker-compose.yml up -d
```

### Production

```bash
docker-compose -f infra/docker/docker-compose.prod.yml up -d
```

**Services started**:
- API Gateway
- Auth Service
- Tracking Service
- Payment Service
- Web App
- MongoDB (replica set)
- Redis (cluster)
- PostgreSQL
- Kafka
- Prometheus + Grafana
- Elasticsearch + Kibana

---

## ☸️ Kubernetes Deployment

### Prerequisites

```bash
- kubectl configured
- Helm 3 installed
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f infra/kubernetes/namespace.yaml

# Deploy databases
kubectl apply -f infra/kubernetes/mongodb-statefulset.yaml
kubectl apply -f infra/kubernetes/redis-statefulset.yaml

# Deploy services
kubectl apply -f infra/kubernetes/api-gateway-deployment.yaml
kubectl apply -f infra/kubernetes/auth-service-deployment.yaml
kubectl apply -f infra/kubernetes/tracking-service-deployment.yaml

# Deploy ingress
kubectl apply -f infra/kubernetes/ingress.yaml

# Check status
kubectl get pods -n tmsa
```

### Autoscaling

Horizontal Pod Autoscaling (HPA) is configured:
- **Min replicas**: 3
- **Max replicas**: 10
- **CPU threshold**: 70%
- **Memory threshold**: 80%

---

## 🏛️ Infrastructure (Terraform)

### Deploy AWS Infrastructure

```bash
cd infra/terraform

# Initialize
terraform init

# Plan
terraform plan

# Apply
terraform apply
```

**Resources created**:
- EKS Cluster (Kubernetes)
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis
- S3 Buckets (documents, backups)
- CloudFront CDN
- VPC, Subnets, Security Groups
- Load Balancers
- Auto Scaling Groups

---

## 📊 Monitoring

### Grafana

**URL**: http://localhost:3001
**Credentials**: admin / admin

**Dashboards**:
- API Gateway metrics
- Service health & uptime
- Database performance
- Request latency (p50, p95, p99)
- Error rates

### Prometheus

**URL**: http://localhost:9090

**Metrics collected**:
- HTTP request duration
- CPU & Memory usage
- Database queries/sec
- WebSocket connections
- Payment transactions

### Kibana (Logs)

**URL**: http://localhost:5601

**Log aggregation**:
- Application logs
- Error traces
- Audit logs (payments, auth)
- Performance logs

---

## 🔐 Security

### Authentication
- JWT tokens (15min access, 7d refresh)
- Bcrypt password hashing
- OAuth 2.0 integration

### API Security
- Rate limiting (per user, per IP)
- CORS configuration
- Helmet.js security headers
- Input validation (class-validator)

### Payment Security
- HMAC signature verification
- PCI-DSS compliant (Stripe)
- Encrypted sensitive data
- Webhook IP whitelisting

### Infrastructure Security
- Network policies (Kubernetes)
- Secrets management (sealed-secrets)
- SSL/TLS everywhere
- Regular security audits

---

## 🌐 Multi-Language Support

Supported languages:
- 🇫🇷 **French** (Français) - Primary
- 🇬🇧 **English** - International
- 🇹🇿 **Swahili** (Kiswahili) - East Africa
- 🇦🇴 **Portuguese** (Português) - Angola

Translation files: `/locales/{fr,en,sw,pt}.json`

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

---

## 📚 API Documentation

### Swagger UI

**URL**: http://localhost:8080/api/docs

### Key Endpoints

```
POST   /auth/login              - User login
POST   /auth/register           - User registration
GET    /missions                - List missions
POST   /missions                - Create mission
GET    /missions/:id            - Get mission details
PATCH  /missions/:id/status     - Update mission status
POST   /tracking/position       - Update GPS position
WS     /tracking                - WebSocket tracking
POST   /payments/initiate       - Initiate payment
GET    /marketplace/listings    - Search marketplace
```

---

## 🤝 Contributing

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Build/config changes

### Branch Strategy
- `main` - Production
- `develop` - Development
- `feature/*` - New features
- `hotfix/*` - Emergency fixes

---

## 📈 Roadmap

### Q1 2024
- [x] Monorepo architecture
- [x] Web dashboard MVP
- [x] Mobile app MVP
- [x] Real-time tracking
- [x] Payment integration

### Q2 2024
- [ ] AI-powered route optimization
- [ ] Predictive maintenance
- [ ] Blockchain for PoD verification
- [ ] Advanced analytics

### Q3 2024
- [ ] Expansion to West Africa
- [ ] Fleet management module
- [ ] Carbon footprint tracking
- [ ] Insurance integration

---

## 👥 Team

- **CTO**: System Architecture & Infrastructure
- **Lead Backend**: Microservices & APIs
- **Lead Frontend**: Web & Mobile Apps
- **DevOps**: CI/CD & Kubernetes
- **Product**: Features & UX

---

## 📞 Support

- **Email**: support@tmsa.africa
- **Slack**: tmsa-team.slack.com
- **Documentation**: docs.tmsa.africa

---

## 📄 License

**Proprietary** - Copyright © 2024 TMSA. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🔥 Performance Benchmarks

- **API Response Time**: < 200ms (p95)
- **WebSocket Latency**: < 100ms
- **GPS Update Frequency**: 30 seconds
- **Uptime**: 99.9% SLA
- **Concurrent Users**: 10,000+

---

## 🎯 Key Metrics (2024)

- **Missions Completed**: 145,000+
- **Trucks Active**: 8,500+
- **Total Distance**: 25M km
- **Carbon Saved**: 12,000 tons
- **Countries**: 8 (RDC, Tanzania, Zambia, SA, Angola, Kenya, Uganda, Malawi)

---

**Built with ❤️ in Africa, for Africa**

🌍 **#AfricaTech** | 🚛 **#TransportInnovation** | 🔥 **#DigitalTransformation**
