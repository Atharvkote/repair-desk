# Repair Desk 

[![Vercel Deployment](https://vercel.com/button)](https://mate-tractors.vercel.app/)


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

```
┌─────────────┬─────────────┬─────────────┐
│   Client    │    Admin    │   Server    │
│ (Next.js)   │  (React)    │ (Express)   │
└──────┬──────┴──────┬──────┴──────┬──────┘
       │             │            │
       └─────────────┼────────────┘
                     │
            ┌────────┴────────┐
            │                 │
         MongoDB           Redis
        (Database)     (Cache/Socket)
```

## Technology Stack

### Backend

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

### Admin Dashboard

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

### Customer Portal

| Technology | Purpose | Version |
|:-----------|:--------|:-------:|
| Next.js | React framework | 14+ |
| TypeScript | Type safety | Latest |
| TailwindCSS | Utility-first CSS | Latest |
| Shadcn/ui | Pre-built components | Latest |
| React Icons | Icon library | Latest |
| Next-intl | i18n for Next.js | Latest |

## Project Structure

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

### Customer Features (Client Portal)

1. Service Request Form: Easy-to-use form to request tractor repairs
2. Service Locator: Find nearby repair centers
3. Live Chat Support: Direct communication with service center
4. Order Tracking: Real-time tracking of repair orders
5. Notifications: Updates on order status
6. Customer Profile: Manage account and service history
7. Mobile Responsive: Works seamlessly on all devices
8. Multi-Language: English and Marathi language support

### Admin Features (Admin Dashboard)

1. Dashboard: Comprehensive business analytics and KPIs
2. Admin Management: User roles and permissions
3. Order Management:
   - Create, assign, and track service orders
   - Real-time status updates
   - Order history and details
   - PDF report generation
4. Service Catalog Management:
   - Add, edit, and delete tractor services
   - Service pricing and descriptions
   - Service availability management
5. Parts Inventory:
   - Track available spare parts
   - Parts pricing and stock management
   - Low-stock alerts
6. Customer Management:
   - Customer database and profiles
   - Service history
   - Contact information
7. Mobile App Integration: Support for mobile service representatives
8. Reports and Analytics:
   - Revenue reports
   - Service completion rates
   - Customer satisfaction metrics
   - PDF export functionality
9. Secure Access: JWT-based authentication
10. Multi-Language Dashboard: English and Marathi

### Security Features

- JWT Authentication: Secure token-based auth
- Password Encryption: bcryptjs hashing
- Helmet.js: HTTP security headers
- Rate Limiting: Protection against brute force attacks
- Redis-based Rate Limiting: Efficient rate limiting
- Role-Based Access Control: Different permission levels
- CORS Protection: Cross-origin security

### Real-Time Features

- Socket.IO Integration: Real-time order updates
- Redis Adapter: Scalable WebSocket communication
- Live Notifications: Instant status updates
- Multi-User Support: Concurrent connections

### Data Management

- MongoDB: Flexible, scalable database
- Collections: Organized data structure
- Advanced Filtering: Search and filter capabilities
- Data Analytics: Comprehensive reporting

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

### Users Collection

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  address: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### ServiceOrder Collection

```javascript
{
  _id: ObjectId,
  customerId: ObjectId,
  services: [ObjectId],
  parts: [{ partId, quantity, price }],
  status: Enum(pending, in-progress, completed),
  totalPrice: Number,
  description: String,
  assignedAdmin: ObjectId,
  createdAt: Date,
  completedAt: Date
}
```

### Service Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  duration: Number,
  isActive: Boolean
}
```

### Parts Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String
}
```

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

### Backend Dependencies

Security and Authentication:
- jsonwebtoken - JWT implementation
- bcryptjs - Password hashing
- helmet - HTTP security
- cookie-parser - Cookie handling

Database and Caching:
- mongoose - MongoDB ODM
- ioredis - Redis client
- @socket.io/redis-streams-adapter - Socket.IO Redis adapter

API and Networking:
- express - Web framework
- cors - Cross-origin handling
- axios - HTTP client
- socket.io - Real-time communication

Rate Limiting and Monitoring:
- express-rate-limit - Rate limiting middleware
- rate-limit-redis - Redis rate store

Utilities:
- dotenv - Environment variables
- chalk - Terminal colors
- body-parser - Request body parsing

### Frontend Dependencies

React Ecosystem:
- react - UI library
- react-dom - React DOM binding
- react-query - Server state management
- react-router - Routing

UI and Styling:
- tailwindcss - Utility-first CSS
- framer-motion - Animations
- radix-ui - Component library
- lucide-react - Icon library
- react-icons - Additional icons

Build Tools:
- vite - Fast build tool
- next.js - React framework

Internationalization:
- i18next - i18n framework
- next-intl - Next.js i18n

Utilities:
- axios - HTTP client
- clsx - Conditional className utility
- jsPDF - PDF generation
- clsx - Conditional CSS classes

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

For more information, visit the project repository or contact the development team.

Made with dedication for farmers and repair technicians.
