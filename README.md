# Repair Desk 

A comprehensive, full-stack web application designed to streamline tractor and agricultural equipment repair services with real-time order tracking, admin management, and customer engagement.

## Overview

Repair Desk is a modern, scalable service management platform specifically built for agricultural equipment repair businesses. It provides a complete ecosystem for managing service orders, tracking repairs, managing inventory of parts, and maintaining customer relationships - all in one integrated platform.

Whether you're a small repair shop or running a large agricultural equipment service center, Repair Desk provides the tools needed to efficiently manage operations, communicate with customers, and scale your business.

### Key Objectives

- Customer-Centric: Provide customers with a seamless way to request repair services
- Admin Control: Give administrators complete visibility and control over orders, parts, and staff
- Real-Time Updates: Track repairs in real-time with Socket.IO integration
- Multi-Language Support: Support for multiple languages (English, Marathi)
- Secure: JWT-based authentication, rate limiting, and encrypted passwords
- Scalable: Modular architecture built for growth

## Project Architecture

The Repair Desk platform is divided into three main applications:

```
repair-desk/
├── server/                 Backend API Server (Node.js + Express)
├── admin/                  Admin Dashboard (React + Vite)
└── client/                 Customer Portal (Next.js)
```

### Architecture Flow

```mermaid
graph TB
    subgraph Applications["Applications"]
        Client["Client<br/>(Next.js)"]
        Admin["Admin<br/>(React)"]
        Server["Server<br/>(Express)"]
    end

    subgraph Data["Data Layer"]
        MongoDB["MongoDB<br/>(Database)"]
        Redis["Redis<br/>(Cache/Socket)"]
    end

    Client -->|API Calls| Server
    Admin -->|API Calls| Server
    Server -->|Store/Query| MongoDB
    Server -->|Cache & Pub/Sub| Redis
    Client -->|WebSocket| Redis
    Admin -->|WebSocket| Redis
```

## Technology Stack

### Tech Stack Overview

| Technology | Description | Role in Project |
|:-:|:-:|:-:|
| **![Node.js](https://skillicons.dev/icons?i=nodejs)**<br>Node.js | JavaScript runtime | Runs the Express backend server for APIs and real-time features |
| **![Express](https://skillicons.dev/icons?i=express)**<br>Express | Web framework | Handles HTTP requests, routing, and WebSocket initialization |
| **![MongoDB](https://skillicons.dev/icons?i=mongodb)**<br>MongoDB | NoSQL database | Stores users, orders, services, and app data |
| **![Redis](https://skillicons.dev/icons?i=redis)**<br>Redis | In-memory data store | Enables caching, rate limiting, and Socket.IO scaling |
| **![Socket.IO](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white)**<br>Socket.IO | Real-time WebSocket library | Enables bi-directional communication for live updates |
| **![React](https://skillicons.dev/icons?i=react)**<br>React | Frontend library | Builds the admin dashboard UI |
| **![Vite](https://skillicons.dev/icons?i=vite)**<br>Vite | Frontend build tool | Fast dev server & bundler for React admin |
| **![Next.js](https://skillicons.dev/icons?i=nextjs)**<br>Next.js | React framework | Builds the customer portal with SSR support |
| **![TypeScript](https://skillicons.dev/icons?i=typescript)**<br>TypeScript | Type-safe language | Provides type safety in frontend code |
| **![Tailwind CSS](https://skillicons.dev/icons?i=tailwind)**<br>Tailwind CSS | Utility-first CSS | Responsive styling across all applications |
| **![Docker](https://skillicons.dev/icons?i=docker)**<br>Docker | Container platform | Containerizes services for consistent deployment |
| **![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)**<br>JWT | Authentication | Secure token-based authentication |
| **![Git](https://skillicons.dev/icons?i=git)**<br>Git | Version control | Tracks code changes and collaboration |
| **![GitHub](https://skillicons.dev/icons?i=github)**<br>GitHub | Code hosting | Repository management and CI/CD |

### Backend Stack Details

| Technology | Purpose | Version |
|:-----------|:--------|:-------:|
| Node.js | Runtime environment | Latest |
| Express.js | REST API framework | v5.2.1 |
| MongoDB | Primary database | v9.0.1 |
| Redis | Caching and rate limiting | v5.8.2 |
| Socket.IO | Real-time communication | Latest |
| JWT | Authentication and authorization | v9.0.3 |
| bcryptjs | Password encryption | v3.0.3 |
| Helmet | Security headers | v8.1.0 |
| CORS | Cross-origin requests | v2.8.5 |
| Rate Limiter | API rate limiting | flexible + redis |

### Admin Dashboard Stack Details

| Technology | Purpose | Version |
|:-----------|:--------|:-------:|
| React | UI framework | 18+ |
| Vite | Build tool | Latest |
| Tailwind CSS | Styling | v4.1.17 |
| Radix UI | Component library | Latest |
| React Query | Server state management | v5.90.16 |
| i18next | Internationalization | v25.7.3 |
| Framer Motion | Animations | v12.23.26 |
| jsPDF | PDF generation | v3.0.4 |
| Axios | HTTP client | v1.13.2 |

### Customer Portal Stack Details

| Technology | Purpose | Version |
|:-----------|:--------|:-------:|
| Next.js | React framework | 14+ |
| TypeScript | Type safety | Latest |
| TailwindCSS | Utility-first CSS | Latest |
| Shadcn/ui | Pre-built components | Latest |
| React Icons | Icon library | Latest |
| Next-intl | i18n for Next.js | Latest |

## System Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Applications"]
        CP["Customer Portal<br/>(Next.js)"]
        AD["Admin Dashboard<br/>(React + Vite)"]
    end

    subgraph Backend["Backend Services"]
        API["Express API Server<br/>(Node.js)"]
        AUTH["Authentication<br/>(JWT + bcryptjs)"]
        SOCKET["Socket.IO Server<br/>(Real-time)"]
    end

    subgraph Data["Data Layer"]
        DB["MongoDB<br/>(Primary DB)"]
        CACHE["Redis<br/>(Cache/Pub-Sub)"]
    end

    subgraph Infrastructure["Infrastructure"]
        DOCKER["Docker<br/>(Containerization)"]
        LOGS["Logging<br/>(Winston/Morgan)"]
    end

    CP -->|REST API| API
    AD -->|REST API| API
    CP -->|WebSocket| SOCKET
    AD -->|WebSocket| SOCKET
    
    API -->|Authenticate| AUTH
    SOCKET -->|Authenticate| AUTH
    
    API -->|Query/Store| DB
    DB -->|Caching| CACHE
    SOCKET -->|Pub/Sub| CACHE
    
    API -->|Logs| LOGS
    SOCKET -->|Logs| LOGS
    
    API -->|Runs In| DOCKER
    DB -->|Runs In| DOCKER
    CACHE -->|Runs In| DOCKER
    
    style CP fill:#3B82F6,stroke:#1F2937,stroke-width:2px,color:#fff
    style AD fill:#8B5CF6,stroke:#1F2937,stroke-width:2px,color:#fff
    style API fill:#10B981,stroke:#1F2937,stroke-width:2px,color:#fff
    style AUTH fill:#F59E0B,stroke:#1F2937,stroke-width:2px,color:#fff
    style SOCKET fill:#EC4899,stroke:#1F2937,stroke-width:2px,color:#fff
    style DB fill:#EF4444,stroke:#1F2937,stroke-width:2px,color:#fff
    style CACHE fill:#FF6B35,stroke:#1F2937,stroke-width:2px,color:#fff
    style DOCKER fill:#1F2937,stroke:#6B7280,stroke-width:2px,color:#fff
    style LOGS fill:#6366F1,stroke:#1F2937,stroke-width:2px,color:#fff
```

## Database Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ SERVICE_ORDERS : places
    USERS ||--o{ CUSTOMER_PROFILES : has
    ADMINS ||--o{ SERVICE_ORDERS : manages
    ADMINS ||--o{ SERVICE_CATALOG : manages
    ADMINS ||--o{ PARTS_CATALOG : manages
    SERVICE_ORDERS ||--|{ SERVICE_CATALOG : requests
    SERVICE_ORDERS ||--o{ PARTS_INVENTORY : uses
    SERVICE_CATALOG ||--o{ SERVICE_CATEGORIES : belongs_to
    PARTS_INVENTORY ||--o{ PARTS_CATEGORIES : belongs_to
    SERVICE_ORDERS ||--o{ ORDER_HISTORY : tracks
    NOTIFICATIONS ||--o{ USERS : informs
    
    USERS {
        ObjectId _id PK
        string firstName
        string lastName
        string email UK
        string phone
        string address
        string passwordHash
        date createdAt
        date updatedAt
    }
    
    CUSTOMER_PROFILES {
        ObjectId _id PK
        ObjectId userId FK
        string businessName
        string location
        string tractorModels
        date lastServiceDate
    }
    
    ADMINS {
        ObjectId _id PK
        string email UK
        string name
        string role
        string passwordHash
        boolean isActive
        date createdAt
    }
    
    SERVICE_ORDERS {
        ObjectId _id PK
        ObjectId customerId FK
        ObjectId adminId FK
        array serviceIds
        array parts
        enum status
        float totalPrice
        string description
        date createdAt
        date completedAt
    }
    
    SERVICE_CATALOG {
        ObjectId _id PK
        ObjectId adminId FK
        string name
        string description
        float price
        int duration
        boolean isActive
        date createdAt
    }
    
    SERVICE_CATEGORIES {
        ObjectId _id PK
        string name
        string description
    }
    
    PARTS_INVENTORY {
        ObjectId _id PK
        ObjectId adminId FK
        string name
        string description
        float price
        int stock
        int minimumStock
        string category
    }
    
    PARTS_CATEGORIES {
        ObjectId _id PK
        string name
        string code
    }
    
    ORDER_HISTORY {
        ObjectId _id PK
        ObjectId orderId FK
        enum status
        string changedBy
        string notes
        date timestamp
    }
    
    NOTIFICATIONS {
        ObjectId _id PK
        ObjectId userId FK
        string type
        string message
        boolean isRead
        date createdAt
    }
```

## Request-Response Flow Diagram

```mermaid
flowchart LR
    subgraph Client["Client Applications"]
        CPortal["Customer Portal<br/>(Next.js)"]
        APortal["Admin Portal<br/>(React)"]
    end
    
    subgraph Middleware["Middleware Pipeline"]
        CORS["CORS"]
        PARSER["JSON Parser"]
        RATE["Rate Limit"]
        AUTH["JWT Auth"]
    end
    
    subgraph Routes["API Routes"]
        AuthAPI["/api/auth"]
        OrderAPI["/api/orders"]
        ServiceAPI["/api/services"]
        PartAPI["/api/parts"]
        DataAPI["/api/data"]
    end
    
    subgraph Controllers["Controllers"]
        AuthCTRL["Auth"]
        OrderCTRL["Order"]
        ServiceCTRL["Service"]
        PartCTRL["Part"]
        DataCTRL["Data"]
    end
    
    subgraph Models["Data Models"]
        UserMDL["User"]
        OrderMDL["Order"]
        ServiceMDL["Service"]
        PartMDL["Part"]
    end
    
    subgraph DB["Database"]
        MongoDB["MongoDB"]
    end
    
    CPortal -->|HTTP/WS| CORS
    APortal -->|HTTP/WS| CORS
    CORS --> PARSER
    PARSER --> RATE
    RATE --> AUTH
    AUTH --> AuthAPI
    AUTH --> OrderAPI
    AUTH --> ServiceAPI
    AUTH --> PartAPI
    AUTH --> DataAPI
    
    AuthAPI --> AuthCTRL
    OrderAPI --> OrderCTRL
    ServiceAPI --> ServiceCTRL
    PartAPI --> PartCTRL
    DataAPI --> DataCTRL
    
    AuthCTRL --> UserMDL
    OrderCTRL --> OrderMDL
    ServiceCTRL --> ServiceMDL
    PartCTRL --> PartMDL
    
    UserMDL --> MongoDB
    OrderMDL --> MongoDB
    ServiceMDL --> MongoDB
    PartMDL --> MongoDB
    
    style CPortal fill:#3B82F6,color:#fff
    style APortal fill:#8B5CF6,color:#fff
    style CORS fill:#F59E0B,color:#fff
    style AUTH fill:#EC4899,color:#fff
    style AuthAPI fill:#10B981,color:#fff
    style OrderAPI fill:#10B981,color:#fff
    style MongoDB fill:#EF4444,color:#fff
```

## Component Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend Layer"]
        subgraph CPortal["Customer Portal (Next.js)"]
            CPAuth["Auth Module"]
            CPOrder["Order Module"]
            CPTrack["Tracking Module"]
            CPProfile["Profile Module"]
        end
        
        subgraph APortal["Admin Dashboard (React)"]
            APAuth["Admin Auth"]
            APDash["Dashboard"]
            APOrder["Order Mgmt"]
            APService["Service Mgmt"]
            APParts["Parts Mgmt"]
            APReports["Reports"]
        end
    end
    
    subgraph Integration["Integration Layer"]
        REST["REST API"]
        WS["WebSocket"]
        EVENTS["Event Bus"]
    end
    
    subgraph Backend["Backend Layer"]
        AUTH["Auth Service"]
        ORDER["Order Service"]
        SERVICE["Service Service"]
        PART["Part Service"]
        NOTIF["Notification Service"]
    end
    
    subgraph Cache["Caching Layer"]
        REDIS["Redis Store"]
        SESSION["Sessions"]
    end
    
    subgraph Persistence["Persistence Layer"]
        MONGO["MongoDB"]
        LOGS["Logs"]
    end
    
    CPAuth -->|HTTP| REST
    CPOrder -->|HTTP| REST
    CPTrack -->|WS| WS
    CPProfile -->|HTTP| REST
    
    APortal -->|HTTP| REST
    APortal -->|WS| WS
    
    REST --> AUTH
    REST --> ORDER
    REST --> SERVICE
    REST --> PART
    REST --> NOTIF
    
    WS -->|Subscribe| EVENTS
    EVENTS -->|Broadcast| PART
    EVENTS -->|Broadcast| ORDER
    EVENTS -->|Broadcast| NOTIF
    
    AUTH -->|Cache| REDIS
    ORDER -->|Cache| REDIS
    SERVICE -->|Cache| REDIS
    PART -->|Cache| REDIS
    
    AUTH -->|Store| MONGO
    ORDER -->|Store| MONGO
    SERVICE -->|Store| MONGO
    PART -->|Store| MONGO
    NOTIF -->|Store| MONGO
    
    ORDER -->|Log| LOGS
    AUTH -->|Log| LOGS
    
    style CPAuth fill:#3B82F6,color:#fff
    style CPOrder fill:#3B82F6,color:#fff
    style APortal fill:#8B5CF6,color:#fff
    style REST fill:#10B981,color:#fff
    style WS fill:#EC4899,color:#fff
    style AUTH fill:#F59E0B,color:#fff
    style REDIS fill:#FF6B35,color:#fff
    style MONGO fill:#EF4444,color:#fff
```

## Technology Integration Flow

```mermaid
graph TB
    subgraph Input["User Input"]
        WEB["Web Browser"]
        MOBILE["Mobile App"]
    end
    
    subgraph Transport["Transport Layer"]
        HTTP["HTTP/HTTPS"]
        WS["WebSocket (Secure)"]
    end
    
    subgraph Processing["Server Processing"]
        PARSER["Request Parser"]
        VALIDATOR["Input Validation"]
        RATELIMIT["Rate Limiting"]
        AUTH["Authentication"]
        PROCESSOR["Business Logic"]
    end
    
    subgraph Storage["Storage Layer"]
        CACHE["Redis Cache"]
        PRIMARY["MongoDB"]
        LOGS["Logging"]
    end
    
    subgraph Response["Response"]
        SERIALIZE["Serialize"]
        COMPRESS["Compress"]
        BROADCAST["Broadcast Events"]
        RETURN["Return Response"]
    end
    
    WEB --> HTTP
    MOBILE --> WS
    HTTP --> PARSER
    WS --> PARSER
    PARSER --> VALIDATOR
    VALIDATOR --> RATELIMIT
    RATELIMIT --> AUTH
    AUTH --> PROCESSOR
    PROCESSOR -->|Check| CACHE
    CACHE -->|Hit| SERIALIZE
    PROCESSOR -->|Miss| PRIMARY
    PRIMARY --> PROCESSOR
    PROCESSOR -->|Log| LOGS
    PROCESSOR --> BROADCAST
    BROADCAST --> SERIALIZE
    SERIALIZE --> COMPRESS
    COMPRESS --> RETURN
    RETURN --> WEB
    RETURN --> MOBILE
    
    style WS fill:#EC4899,color:#fff
    style HTTP fill:#3B82F6,color:#fff
    style PROCESSOR fill:#10B981,color:#fff
    style CACHE fill:#FF6B35,color:#fff
    style PRIMARY fill:#EF4444,color:#fff
    style AUTH fill:#F59E0B,color:#fff
```

## Data Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant User as User<br/>(Client Portal)
    participant Admin as Admin<br/>(Admin Panel)
    participant API as Express API
    participant AUTH as Auth Service
    participant Cache as Redis
    participant DB as MongoDB
    participant Socket as Socket.IO
    
    User->>API: POST /api/orders (Create Order)
    API->>AUTH: Verify JWT Token
    AUTH-->>API: Token Valid
    API->>Cache: Check Rate Limit
    Cache-->>API: OK
    API->>DB: Save Order to MongoDB
    DB-->>API: Order ID: 123
    API->>Cache: Publish Event (order:created)
    Cache->>Socket: Broadcast to Subscribers
    Socket-->>Admin: New Order Notification
    Socket-->>User: Order Confirmation
    API-->>User: 200 OK (Order ID: 123)
    
    Note over Admin: Admin Reviews Order
    Admin->>API: PATCH /api/orders/123 (Update Status)
    API->>AUTH: Verify Admin Token
    AUTH-->>API: Token Valid
    API->>DB: Update Order Status
    DB-->>API: Updated
    API->>Cache: Publish Event (order:updated)
    Cache->>Socket: Broadcast Status Change
    Socket-->>User: Order Status: In Progress
    API-->>Admin: 200 OK (Update Complete)
```

### Backend (server/)

```
server/
├── controllers/         Request handlers for each feature
│   ├── admin.controller.js
│   ├── customer.controller.js
│   ├── data.controller.js
│   ├── part.controller.js
│   ├── service-order.controller.js
│   ├── service.controller.js
│   └── user.controller.js
├── models/             MongoDB schemas and data models
│   ├── admin.model.js
│   ├── data.model.js
│   ├── parts-catalog.model.js
│   ├── service-catalog.model.js
│   ├── service.model.js
│   └── user.model.js
├── routers/            API endpoint definitions
│   ├── admin-auth.routes.js
│   ├── customer.routes.js
│   ├── data.routes.js
│   ├── part.routes.js
│   ├── service-order.routes.js
│   ├── service.routes.js
│   └── user-auth.routes.js
├── middlewares/        Request processing middleware
│   ├── admin-auth-middleware.js
│   ├── auth.middleware.js
│   └── authorize.middleware.js
├── configs/            Configuration files
│   ├── jwt.config.js
│   └── mongodb.config.js
├── utils/              Utility functions
│   ├── logger.js
│   ├── order-transform.js
│   └── recalc-order.js
├── socket-handlers/    WebSocket event handlers
│   └── order-handler.js
├── cache/              Cache-related files
├── logs/               Application logs
├── keys/               API keys and certificates
└── server.js          Main server entry point
```

### Admin Dashboard (admin/)

```
admin/
├── src/
│   ├── components/          React components
│   │   ├── admin/          Admin-specific components
│   │   ├── auth/           Authentication components
│   │   ├── customs/        Custom components
│   │   ├── layout/         Layout components
│   │   ├── shared/         Shared across app components
│   │   └── ui/             UI component library
│   ├── contexts/           React context for state management
│   │   └── admin-auth-context.jsx
│   ├── hooks/              Custom React hooks
│   │   ├── useData.ts
│   │   ├── useDebounce.ts
│   │   └── useLanguage.js
│   ├── lib/                Library functions and utilities
│   │   ├── api.js
│   │   ├── i18n.js
│   │   ├── react-query.ts
│   │   └── utils.js
│   ├── locales/            Translation files
│   │   ├── en/
│   │   └── mr/
│   ├── pages/              Page components
│   │   ├── admin/
│   │   └── auth/
│   ├── services/           API service calls
│   └── App.jsx
├── vite.config.js
├── package.json
└── index.html
```

### Customer Portal (client/)

```
client/
├── app/                     Next.js app router pages
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   ├── contact/
│   └── services/
├── components/              Reusable React components
│   └── ui/                 UI component library
├── lib/                     Utilities and helpers
│   └── utils.ts
├── i18n/                    Internationalization config
├── messages/                Translation messages
├── public/                  Static assets
└── tsconfig.json
```

## Core Features

### Feature Architecture Diagram

```mermaid
graph TB
    subgraph Customer["Customer Features (Client Portal)"]
        SR["Service Request Form"]
        SL["Service Locator"]
        LC["Live Chat Support"]
        OT["Order Tracking"]
        NT["Notifications"]
        CP["Customer Profile"]
        MR["Mobile Responsive"]
        ML["Multi-Language"]
    end
    
    subgraph Admin["Admin Features (Admin Dashboard)"]
        DB["Dashboard Analytics"]
        AM["Admin Management"]
        OM["Order Management"]
        SM["Service Catalog"]
        PI["Parts Inventory"]
        CM["Customer Management"]
        MI["Mobile Int egration"]
        RA["Reports Analytics"]
    end
    
    subgraph Security["Security Features"]
        JWT["JWT Auth"]
        PE["Password Encryption"]
        HE["HTTP Headers"]
        RL["Rate Limiting"]
        RBAC["Role-Based Access"]
        CORS["CORS Protection"]
    end
    
    subgraph RealTime["Real-Time Features"]
        SIO["Socket.IO Integration"]
        RA_RT["Redis Adapter"]
        LN["Live Notifications"]
        MU["Multi-User Support"]
    end
    
    subgraph Data["Data Management"]
        MDB["MongoDB"]
        COL["Collections"]
        AF["Advanced Filtering"]
        DA["Data Analytics"]
    end
    
    Customer --> SIO
    Admin --> SIO
    Customer --> JWT
    Admin --> JWT
    SIO --> RA_RT
    RA_RT --> MDB
    
    style Customer fill:#3B82F6,color:#fff
    style Admin fill:#8B5CF6,color:#fff
    style Security fill:#EF4444,color:#fff
    style RealTime fill:#EC4899,color:#fff
    style Data fill:#F59E0B,color:#fff
```

## Getting Started

### Prerequisites

- Node.js v18 or later
- npm, yarn, or pnpm package manager
- MongoDB (local or cloud instance - MongoDB Atlas recommended)
- Redis server (for caching and Socket.IO)
- Git for version control

### Environment Setup

Create .env files in the respective directories with the following configurations:

#### Server (.env)

```env
# Server Port
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/repair-desk
MONGODB_DB_NAME=repair-desk

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here
JWT_ADMIN_SECRET=your-admin-jwt-secret-key
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Environment
NODE_ENV=development
```

#### Admin Dashboard (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### Client Portal (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Installation Steps

#### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/repair-desk.git
cd repair-desk
```

#### Step 2: Backend Setup

```bash
cd server
pnpm install
# Create .env file with configurations
pnpm run dev
```

The server will start on http://localhost:5000

#### Step 3: Admin Dashboard Setup

```bash
cd admin
pnpm install
# Create .env.local file
pnpm run dev
```

The admin panel will be available at http://localhost:5173

#### Step 4: Customer Portal Setup

```bash
cd client
pnpm install
# Create .env.local file
pnpm run dev
```

The customer portal will be available at http://localhost:3000

#### Step 5: Verify Installation

- Navigate to http://localhost:3000 - Customer Portal
- Navigate to http://localhost:5173 - Admin Dashboard
- Backend API: http://localhost:5000/api

## API Endpoints Overview

### Authentication Routes

```
POST   /api/auth/login              User login
POST   /api/auth/register           User registration
POST   /api/auth/logout             User logout
POST   /api/auth/refresh            Refresh JWT token

POST   /api/admin/auth/login        Admin login
POST   /api/admin/auth/logout       Admin logout
```

### Service Management

```
GET    /api/services                Get all services
POST   /api/services                Create new service
PATCH  /api/services/:id            Update service
DELETE /api/services/:id            Delete service
```

### Order Management

```
GET    /api/orders                  Get all orders
POST   /api/orders                  Create new order
GET    /api/orders/:id              Get order details
PATCH  /api/orders/:id              Update order status
DELETE /api/orders/:id              Delete order
```

### Parts Catalog

```
GET    /api/parts                   Get all parts
POST   /api/parts                   Add new part
PATCH  /api/parts/:id               Update part
DELETE /api/parts/:id               Delete part
```

### Customer Management

```
GET    /api/customers               Get all customers
GET    /api/customers/:id           Get customer details
PATCH  /api/customers/:id           Update customer info
```

### Data and Reports

```
GET    /api/data/dashboard          Dashboard analytics
GET    /api/data/reports            Detailed reports
GET    /api/data/statistics         Business statistics
```

## Database Schema Overview

The database uses MongoDB with the following entity relationships:

```mermaid
erDiagram
    USERS ||--o{ SERVICE_ORDERS : places
    USERS ||--o{ CUSTOMER_PROFILES : has
    ADMINS ||--o{ SERVICE_ORDERS : manages
    ADMINS ||--o{ SERVICE_CATALOG : manages
    ADMINS ||--o{ PARTS_CATALOG : manages
    SERVICE_ORDERS ||--|{ SERVICE_CATALOG : requests
    SERVICE_ORDERS ||--o{ PARTS_INVENTORY : uses
    SERVICE_CATALOG ||--o{ SERVICE_CATEGORIES : belongs_to
    PARTS_INVENTORY ||--o{ PARTS_CATEGORIES : belongs_to
    SERVICE_ORDERS ||--o{ ORDER_HISTORY : tracks
    NOTIFICATIONS ||--o{ USERS : informs
    
    USERS {
        ObjectId _id PK
        string firstName
        string lastName
        string email UK
        string phone
        string address
        string passwordHash
        date createdAt
        date updatedAt
    }
    
    CUSTOMER_PROFILES {
        ObjectId _id PK
        ObjectId userId FK
        string businessName
        string location
        string tractorModels
        date lastServiceDate
    }
    
    ADMINS {
        ObjectId _id PK
        string email UK
        string name
        string role
        string passwordHash
        boolean isActive
        date createdAt
    }
    
    SERVICE_ORDERS {
        ObjectId _id PK
        ObjectId customerId FK
        ObjectId adminId FK
        array serviceIds
        array parts
        enum status
        float totalPrice
        string description
        date createdAt
        date completedAt
    }
    
    SERVICE_CATALOG {
        ObjectId _id PK
        ObjectId adminId FK
        string name
        string description
        float price
        int duration
        boolean isActive
        date createdAt
    }
    
    SERVICE_CATEGORIES {
        ObjectId _id PK
        string name
        string description
    }
    
    PARTS_INVENTORY {
        ObjectId _id PK
        ObjectId adminId FK
        string name
        string description
        float price
        int stock
        int minimumStock
        string category
    }
    
    PARTS_CATEGORIES {
        ObjectId _id PK
        string name
        string code
    }
    
    ORDER_HISTORY {
        ObjectId _id PK
        ObjectId orderId FK
        enum status
        string changedBy
        string notes
        date timestamp
    }
    
    NOTIFICATIONS {
        ObjectId _id PK
        ObjectId userId FK
        string type
        string message
        boolean isRead
        date createdAt
    }
```

### Key Relationships

- **USERS** → Places SERVICE_ORDERS and receives NOTIFICATIONS
- **ADMINS** → Manages SERVICE_ORDERS, SERVICE_CATALOG, and PARTS_CATALOG
- **SERVICE_ORDERS** → Links customers with services, tracks order history, and manages parts usage
- **SERVICE_CATALOG** → Organized by SERVICE_CATEGORIES
- **PARTS_INVENTORY** → Managed by categories and used in SERVICE_ORDERS
- **ORDER_HISTORY** → Maintains audit trail of status changes

## Real-Time Updates with Socket.IO

### Available Socket Events

Server to Client:

```javascript
// Order updates
socket.on('order:created', (orderData) => {})
socket.on('order:updated', (orderData) => {})
socket.on('order:status-changed', (status) => {})
socket.on('order:completed', (orderData) => {})

// Notifications
socket.on('notification:new', (notificationData) => {})
socket.on('notification:read', (notificationId) => {})
```

Client to Server:

```javascript
// Order tracking
socket.emit('order:subscribe', { orderId })
socket.emit('order:unsubscribe', { orderId })

// Status updates
socket.emit('order:status-update', { orderId, status })
```

## Deployment

### Railway.app (Recommended)

The project includes railway.json configuration for Docker deployment:

```bash
# Login to Railway
railway login

# Deploy
railway up
```

### Docker and Docker Compose

```bash
# Build Docker image
docker-compose up -d

# View logs
docker-compose logs -f
```

### Vercel (Client Portal)

```bash
# Deploy to Vercel
vercel deploy
```

## Testing

```bash
# Run tests (when configured)
pnpm run test

# Run linting
pnpm run lint

# Build for production
pnpm run build
```

## Dependencies Summary

### Dependencies Architecture Diagram

```mermaid
graph TB
    subgraph Backend["Backend Dependencies"]
        subgraph Auth["Security/Auth"]
            JWT["jsonwebtoken"]
            BCRYPT["bcryptjs"]
            HELMET["helmet"]
            CP["cookie-parser"]
        end
        
        subgraph DB["Database/Cache"]
            MONGOOSE["mongoose"]
            IOREDIS["ioredis"]
            SIOREDIS["socket.io-redis-adapter"]
        end
        
        subgraph API["API/Networking"]
            EXPRESS["express"]
            CORS_PKG["cors"]
            AXIOS_BE["axios"]
            SIO["socket.io"]
        end
        
        subgraph Limit["Rate Limiting"]
            RATELIMIT["express-rate-limit"]
            RLREDIS["rate-limit-redis"]
        end
        
        subgraph Utils["Utilities"]
            DOTENV["dotenv"]
            CHALK["chalk"]
            BP["body-parser"]
        end
    end
    
    subgraph Frontend["Frontend Dependencies"]
        subgraph React["React Ecosystem"]
            REACT["react"]
            REACTDOM["react-dom"]
            RQ["react-query"]
            RR["react-router"]
        end
        
        subgraph Style["UI/Styling"]
            TC["tailwindcss"]
            FM["framer-motion"]
            RUI["radix-ui"]
            LR["lucide-react"]
            RI["react-icons"]
        end
        
        subgraph Build["Build Tools"]
            VITE["vite"]
            NEXT["next.js"]
        end
        
        subgraph I18n["Internationalization"]
            I18NEXT["i18next"]
            NINTL["next-intl"]
        end
        
        subgraph FUtils["Utilities"]
            AXIOS_FE["axios"]
            CLSX["clsx"]
            JSPDF["jsPDF"]
        end
    end
    
    JWT --> Express
    BCRYPT --> JWT
    HELMET --> EXPRESS
    MONGOOSE --> DB
    IOREDIS --> DB
    EXPRESS --> SIO
    SIO --> IOREDIS
    RATELIMIT --> RLREDIS
    
    REACT --> RQ
    REACT --> VITE
    TC --> FM
    RUI --> LR
    NEXT --> AXIOS_FE
    I18NEXT --> NINTL
    
    style Auth fill:#EF4444,color:#fff
    style DB fill:#F59E0B,color:#fff
    style API fill:#10B981,color:#fff
    style React fill:#3B82F6,color:#fff
    style Style fill:#8B5CF6,color:#fff
    style Build fill:#06B6D4,color:#fff
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

### Coding Standards

- Use consistent naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test before submitting PR
- Follow ESLint rules

## Project Roadmap

- Core service management system
- Admin dashboard
- Customer portal
- Real-time updates
- In Progress: Mobile app
- Planned: SMS/Email notifications
- Planned: Payment integration
- Planned: Advanced analytics
- Planned: AI-powered scheduling
- Planned: Inventory management improvements

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support and Issues

Found a bug? Have a suggestion?

- Email: support@repairdesk.com
- GitHub Issues: https://github.com/yourusername/repair-desk/issues
- GitHub Discussions: https://github.com/yourusername/repair-desk/discussions

## Acknowledgments

- Built with modern web technologies
- Special thanks to the open-source community
- Inspired by real-world repair management needs

## Summary

Repair Desk is a complete solution for agricultural equipment service management. With its modern tech stack, real-time capabilities, and comprehensive feature set, it provides everything needed to run an efficient repair service business. The modular architecture ensures scalability, while the focus on security and user experience makes it suitable for businesses of any size.