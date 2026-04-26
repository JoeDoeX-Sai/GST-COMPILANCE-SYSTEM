# Software Requirements Specification (SRS)
# GST Compliance & Transaction Management System

**Version:** 2.0.0
**Date:** April 2026
**Team:** Sai-Kiran, Teja, Aditya

---

## TABLE OF CONTENTS

1. Introduction
2. Project Overview
3. System Architecture
4. Tech Stack
5. Functional Requirements
6. Non-Functional Requirements
7. User Roles & Permissions
8. Module-wise Features
9. Database Design
10. API Endpoints
11. Security Design
12. UI/UX Design
13. Testing
14. Deployment
15. Future Scope

---

## 1. INTRODUCTION

### 1.1 Purpose
This SRS defines the complete requirements for the GST Compliance and Transaction Management System — a web-based platform that helps businesses manage GST filings, invoices, compliance deadlines, and financial reporting in one place.

### 1.2 Scope
The system covers:
- GST invoice creation and management
- Automated GST return preparation (GSTR-1, GSTR-3B)
- Compliance calendar with deadline tracking
- Multi-business support
- Real-time admin-user chat
- AI-powered GST assistant chatbot
- Role-based access control
- Analytics and reporting dashboard

### 1.3 Intended Audience
- Presentation evaluators / faculty
- Development team (Sai-Kiran, Teja, Aditya)
- Future developers and maintainers

### 1.4 Definitions
| Term | Meaning |
|------|---------|
| GST | Goods and Services Tax |
| GSTIN | GST Identification Number |
| GSTR | GST Return |
| IGST | Integrated GST (inter-state) |
| CGST | Central GST (intra-state) |
| SGST | State GST (intra-state) |
| HSN | Harmonized System of Nomenclature |
| SAC | Services Accounting Code |
| JWT | JSON Web Token |
| RBAC | Role-Based Access Control |
| SPA | Single Page Application |

---

## 2. PROJECT OVERVIEW

### 2.1 Problem Statement
Small and medium businesses in India struggle with:
- Manual GST calculations prone to errors
- Missing compliance deadlines leading to penalties
- No centralized system for invoices, returns, and reconciliation
- Lack of real-time support for GST queries

### 2.2 Solution
A full-stack web application that automates GST compliance workflows, provides real-time support, and gives businesses a single dashboard to manage all GST-related activities.

### 2.3 Key Highlights
- Auto-calculates CGST, SGST, IGST based on supply type
- Tracks all compliance deadlines with alerts
- Multi-business support under one account
- Real-time chat between users and admin
- AI chatbot for instant GST query resolution
- Export reports as PDF and Excel
- Light/Dark theme support
- Fully responsive (mobile-friendly)

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Architecture Pattern
**MVC (Model-View-Controller)** with SPA frontend

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                    │
│  ┌─────────────────────────────────────────────┐    │
│  │         Single Page Application (SPA)        │    │
│  │   HTML + Vanilla JS + CSS (Hash Routing)     │    │
│  └──────────────────┬──────────────────────────┘    │
└─────────────────────┼───────────────────────────────┘
                      │ HTTP / WebSocket
┌─────────────────────▼───────────────────────────────┐
│                  EXPRESS.JS SERVER                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Routes  │  │Middleware│  │   Socket.IO       │  │
│  │  (REST)  │  │(Auth/Val)│  │  (Real-time Chat) │  │
│  └────┬─────┘  └──────────┘  └──────────────────┘  │
│       │                                              │
│  ┌────▼──────────────────────────────────────────┐  │
│  │              Business Logic Layer              │  │
│  │   (GST Calc, Compliance, AI, Mailer, Export)  │  │
│  └────┬──────────────────────────────────────────┘  │
└───────┼─────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────────┐
│                    MONGODB DATABASE                  │
│   Users │ Businesses │ Invoices │ Returns │ Chat    │
└─────────────────────────────────────────────────────┘
```

### 3.2 Folder Structure
```
Web Design/
├── backend/
│   ├── middleware/       # Auth, Validation
│   ├── models/           # MongoDB Schemas
│   ├── routes/           # REST API Endpoints
│   ├── utils/            # AI, GST, Mailer, Logger, Swagger
│   └── server.js         # Entry Point
├── frontend/
│   └── html/             # HTML Pages
├── css/                  # Stylesheets
├── js/                   # Frontend JavaScript
├── tests/                # Jest Test Suites
├── logs/                 # Winston Log Files
├── .env                  # Environment Config
└── package.json          # Dependencies
```

---

## 4. TECH STACK

### 4.1 Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | v14+ | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| MongoDB | 4.4+ | Primary database |
| Mongoose | 9.3.3 | ODM for MongoDB |
| Socket.IO | 4.8.3 | Real-time communication |
| JWT | 9.0.2 | Authentication tokens |
| bcryptjs | 2.4.3 | Password hashing |
| Passport.js | 0.7.0 | OAuth (Google, GitHub, Facebook) |
| Groq SDK | 1.1.2 | AI chatbot integration |
| Winston | 3.19.0 | Logging |
| Swagger | 6.2.8 | API documentation |
| PDFKit | 0.14.0 | PDF export |
| ExcelJS | 4.4.0 | Excel export |
| node-cron | 3.0.3 | Scheduled compliance checks |
| Nodemailer | 8.0.4 | Email notifications |
| Helmet | 7.1.0 | Security headers |
| express-rate-limit | 7.1.5 | API rate limiting |

### 4.2 Frontend
| Technology | Purpose |
|-----------|---------|
| Vanilla JavaScript (ES6+) | Core application logic |
| Custom CSS (CSS Variables) | Theming and styling |
| Chart.js | Analytics charts |
| Socket.IO Client | Real-time chat |
| Hash-based Routing | SPA navigation |

### 4.3 DevOps & Testing
| Tool | Purpose |
|------|---------|
| Jest | Unit testing |
| Supertest | API testing |
| Nodemon | Dev auto-restart |
| GitHub Actions | CI/CD pipeline |
| Winston Daily Rotate | Log management |

---

## 5. FUNCTIONAL REQUIREMENTS

### FR-01: User Authentication
- Users can register with name, email, password
- Users can log in with email and password
- JWT token issued on successful login (7-day expiry)
- Email verification in production mode
- Auto-verify in development/test mode
- Forgot password with OTP token
- Reset password with token
- OAuth login via Google, GitHub, Facebook
- Session expires on logout

### FR-02: Role-Based Access Control
- Three roles: Admin, Accountant, Viewer
- Admin has full system access
- Accountant can create/edit invoices and returns
- Viewer has read-only access
- Sidebar navigation filtered by role
- API endpoints protected by role middleware

### FR-03: Business Management
- Admin can create multiple businesses
- Each business has GSTIN, legal name, trade name, state
- Users assigned to businesses
- Business switcher in dashboard
- Business request workflow for new users

### FR-04: Invoice Management
- Create sales and purchase invoices
- Auto-calculate CGST, SGST, IGST based on supply type
- Support for multiple line items with HSN codes
- Discount and cess calculations
- Invoice status: Draft, Confirmed, Cancelled, Amended
- PDF export of invoices
- Filter by date, status, party

### FR-05: GST Returns
- Prepare GSTR-1 (outward supplies)
- Prepare GSTR-3B (summary return)
- Period-wise return tracking
- Filing status management
- Return data export

### FR-06: Compliance Calendar
- Track all GST filing deadlines
- Status: Pending, Filed, Overdue
- Browser notifications for overdue items
- Notification badge in topbar
- Auto-update overdue status via cron job (daily at 6 AM)

### FR-07: Party Management
- Maintain customer and vendor database
- GSTIN validation
- State-wise party classification
- Link parties to invoices

### FR-08: HSN/SAC Lookup
- Search HSN codes for goods
- Search SAC codes for services
- Display applicable GST rates

### FR-09: Reconciliation
- Match purchase invoices with GSTR-2A/2B data
- Identify matched, mismatched, and missing entries
- Reconciliation report export

### FR-10: Analytics Dashboard
- Revenue trends (monthly/quarterly)
- GST liability breakdown (CGST/SGST/IGST)
- Top parties by transaction value
- Compliance score
- Chart.js visualizations

### FR-11: Real-time Chat System
- Users can chat with admin support
- Admin can view all user conversations
- Socket.IO for real-time message delivery
- Unread message badges
- AI bot auto-replies when admin is offline
- Bot escalates to support ticket after 2 failed replies
- Message rate limiting (20 messages per 10 seconds)
- Typing indicators

### FR-12: AI Chatbot
- Powered by Groq SDK (LLM)
- Answers GST-related queries
- Keyword-based fallback responses
- Integrated in chat widget

### FR-13: Profile Management
- View and edit personal information
- Change password
- View assigned businesses
- Switch between businesses
- Theme and currency settings

### FR-14: Support Tickets
- Users can raise support tickets
- Admin can view and manage tickets
- Ticket status tracking
- Business request management

### FR-15: Export & Reports
- Export invoices as PDF
- Export data as Excel
- Analytics report download
- Audit trail export

### FR-16: Audit Trail
- Log all user actions
- Admin-only access
- Filter by user, action, date
- Compliance audit support

### FR-17: Multi-currency Support
- INR (default), USD, EUR
- Real-time currency conversion display
- Persistent currency preference

### FR-18: Theme Support
- Light and Dark mode
- System preference detection
- Persistent theme preference

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance
- API response time < 500ms for standard requests
- Support 100+ concurrent users
- Rate limiting: 500 requests per 15 minutes per IP
- Socket.IO ping timeout: 60 seconds

### 6.2 Security
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiry
- Helmet.js security headers
- CORS protection
- Input validation on all endpoints (express-validator)
- XSS prevention (HTML escaping in frontend)
- Role-based API protection
- Rate limiting on all /api/ routes

### 6.3 Reliability
- Winston logging with daily log rotation
- Error logs separate from app logs
- Graceful error handling on all routes
- MongoDB connection retry logic
- Cron job for compliance status updates

### 6.4 Usability
- Responsive design (mobile, tablet, desktop)
- Light/Dark theme
- Toast notifications for all actions
- Confirmation modals for destructive actions
- Loading states on async operations

### 6.5 Maintainability
- Modular route structure
- Swagger API documentation at /api-docs
- Environment-based configuration
- Jest test suite (17 tests)
- GitHub Actions CI/CD pipeline

### 6.6 Scalability
- Stateless JWT authentication (horizontal scaling ready)
- MongoDB for flexible schema evolution
- Compression middleware for response optimization

---

## 7. USER ROLES & PERMISSIONS

| Feature | Admin | Accountant | Viewer |
|---------|-------|-----------|--------|
| Login/Logout | ✅ | ✅ | ✅ |
| View Dashboard | ✅ | ✅ | ✅ |
| Create Invoice | ✅ | ✅ | ❌ |
| Edit Invoice | ✅ | ✅ | ❌ |
| Delete Invoice | ✅ | ❌ | ❌ |
| Manage Businesses | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Audit Trail | ✅ | ❌ | ❌ |
| File GST Returns | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ✅ |
| Chat (Admin View) | ✅ | ❌ | ❌ |
| Chat (User View) | ✅ | ✅ | ✅ |
| Export Reports | ✅ | ✅ | ✅ |
| Manage Tickets | ✅ | ❌ | ❌ |

---

## 8. MODULE-WISE FEATURES

### Module 1: Authentication & Security
- Register, Login, Logout
- JWT token management
- OAuth (Google, GitHub, Facebook)
- Forgot/Reset password
- Email verification
- Session management

### Module 2: Dashboard
- KPI cards (Total Tax, Invoices, Compliance Score)
- Revenue chart (Chart.js)
- GST liability breakdown
- Recent invoices table
- Compliance alerts widget
- Quick action buttons

### Module 3: Invoice Management
- Sales invoice CRUD
- Purchase invoice CRUD
- GST auto-calculation engine
- Multi-line item support
- PDF generation
- Status workflow (Draft → Confirmed → Filed)

### Module 4: GST Returns
- GSTR-1 preparation
- GSTR-3B preparation
- Period selector
- Filing status tracker
- Return summary view

### Module 5: Compliance Calendar
- Monthly deadline view
- Status badges (Pending/Filed/Overdue)
- Browser push notifications
- Automated overdue detection

### Module 6: Party Management
- Customer/Vendor CRUD
- GSTIN validation
- State code mapping
- Party-wise transaction history

### Module 7: Analytics
- Revenue trends (bar/line charts)
- Tax breakdown (pie chart)
- Top parties ranking
- Period comparison
- Export analytics report

### Module 8: Chat & Support
- Real-time user-admin chat (Socket.IO)
- AI bot with keyword matching
- Groq LLM integration
- Support ticket creation
- Unread message tracking
- Typing indicators

### Module 9: Profile & Settings
- Personal info management
- Password change
- Business switcher
- Theme toggle (Light/Dark)
- Currency selector (INR/USD/EUR)

### Module 10: Admin Panel
- User management (CRUD)
- Business management
- Business request approvals
- Audit trail viewer
- System backup info

### Module 11: Landing Page
- Product showcase
- 3D interactive dashboard preview (mouse tilt effect)
- Scroll progress indicator
- Back-to-top button
- Social media links
- Navigation to login/register

---

## 9. DATABASE DESIGN

### Collections (MongoDB)

#### users
```
{
  _id, name, email, password (hashed),
  role: [admin | accountant | viewer],
  active: 1|0,
  emailVerified: Boolean,
  emailVerifyToken, emailVerifyExpires,
  resetPasswordToken, resetPasswordExpires,
  phone, created_at
}
```

#### businesses
```
{
  _id, legal_name, trade_name, gstin,
  state_code, address, active: 1|0,
  created_at
}
```

#### user_businesses (junction)
```
{ _id, user_id, business_id }
```

#### invoices
```
{
  _id, business_id, invoice_number, invoice_date,
  party_id, supply_type: [intra|inter],
  items: [{ description, hsn_code, quantity, unit_price,
            gst_rate, cgst, sgst, igst, cess, total }],
  status: [draft|confirmed|cancelled|amended],
  created_by, created_at
}
```

#### parties
```
{
  _id, business_id, name, gstin, state_code,
  type: [customer|vendor], address, created_at
}
```

#### compliance
```
{
  _id, business_id, return_type, period,
  due_date, status: [pending|filed|overdue],
  filed_date
}
```

#### tickets
```
{
  _id, user_id, business_id, subject,
  description, status: [open|in-progress|closed],
  created_at
}
```

#### chats
```
{
  _id, room, sender, senderName, role,
  message, read: Boolean, created_at
}
```

#### conversations
```
{
  _id, userId, userName, lastMessage,
  lastTime, unreadCount
}
```

#### messages
```
{
  _id, conversationId, sender, content,
  timestamp, read: Boolean
}
```

#### business_requests
```
{
  _id, user_id, business_name, gstin,
  status: [pending|approved|rejected],
  created_at
}
```

---

## 10. API ENDPOINTS

### Authentication — /api/auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /login | User login | No |
| POST | /register | User registration | No |
| GET | /me | Get current user | JWT |
| GET | /profile | Get profile | JWT |
| PUT | /profile | Update profile | JWT |
| POST | /change-password | Change password | JWT |
| POST | /forgot-password | Request reset token | No |
| POST | /reset-password | Reset with token | No |
| POST | /verify-email | Verify email token | No |
| GET | /google | Google OAuth | No |
| GET | /github | GitHub OAuth | No |
| GET | /facebook | Facebook OAuth | No |

### Businesses — /api/businesses
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | / | List businesses | Admin |
| POST | / | Create business | Admin |
| PUT | /:id | Update business | Admin |
| DELETE | /:id | Delete business | Admin |

### Invoices — /api/invoices
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | / | List invoices | JWT |
| POST | / | Create invoice | JWT |
| GET | /:id | Get invoice | JWT |
| PUT | /:id | Update invoice | JWT |
| DELETE | /:id | Delete invoice | Admin |

### GST Returns — /api/returns
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | / | List returns | JWT |
| POST | / | Create return | JWT |
| PUT | /:id | Update return | JWT |

### Compliance — /api/compliance
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | / | List compliance items | JWT |
| POST | / | Create compliance item | Admin |
| PUT | /:id | Update status | JWT |

### Analytics — /api/analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /dashboard | Dashboard KPIs | JWT |
| GET | /trends | Revenue trends | JWT |

### Chat — /api/chat
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /rooms | All chat rooms | Admin |
| GET | /:room | Room history | JWT |

### Tickets — /api/tickets
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | / | List tickets | JWT |
| POST | / | Create ticket | JWT |
| PUT | /:id | Update ticket | Admin |

### Business Requests — /api/business-requests
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | / | List requests | Admin |
| POST | / | Submit request | JWT |
| PUT | /:id | Approve/Reject | Admin |

### Other Routes
| Route | Description |
|-------|-------------|
| GET /api/parties | Party management |
| GET /api/purchases | Purchase management |
| GET /api/reconcile | Reconciliation |
| GET /api/hsn | HSN/SAC lookup |
| GET /api/tds | TDS management |
| GET /api/export | Data export |
| GET /api/audit | Audit trail |
| GET /api/users | User management |
| GET /api-docs | Swagger UI |

---

## 11. SECURITY DESIGN

### 11.1 Authentication Flow
```
User Login
    │
    ▼
Validate Input (express-validator)
    │
    ▼
Find User in MongoDB
    │
    ▼
Compare Password (bcrypt.compareSync)
    │
    ▼
Check emailVerified flag
    │
    ▼
Sign JWT (7-day expiry)
    │
    ▼
Return token + user info
```

### 11.2 Request Authorization Flow
```
API Request
    │
    ▼
Rate Limiter (500 req/15min)
    │
    ▼
Helmet Headers Applied
    │
    ▼
JWT Middleware (verify token)
    │
    ▼
Role Check (RBAC)
    │
    ▼
Business Access Check
    │
    ▼
Route Handler
```

### 11.3 Security Measures
- **Passwords**: bcrypt with 10 salt rounds
- **Tokens**: JWT HS256, 7-day expiry
- **Headers**: Helmet.js (XSS, HSTS, CSP disabled for SPA)
- **Rate Limiting**: 500 req/15min on all /api/ routes
- **Input Validation**: express-validator on all POST/PUT routes
- **XSS Prevention**: HTML escaping (escHtml) in all frontend renders
- **CORS**: Enabled for all origins (configurable for production)
- **Audit Logging**: All actions logged with user, timestamp, IP

---

## 12. UI/UX DESIGN

### 12.1 Pages
| Page | URL | Description |
|------|-----|-------------|
| Landing Page | / | Product showcase with 3D preview |
| Login/Register | /#login | Auth screen |
| Dashboard | /#dashboard | KPIs and overview |
| Invoices | /#invoices | Invoice management |
| Purchases | /#purchases | Purchase tracking |
| GST Returns | /#returns | Return filing |
| Compliance | /#compliance | Deadline calendar |
| Parties | /#parties | Customer/Vendor DB |
| Reconciliation | /#reconcile | Invoice matching |
| Analytics | /#analytics | Charts and reports |
| HSN Lookup | /#hsn | Code search |
| TDS | /#tds | TDS management |
| Audit Trail | /#audit | Activity log (Admin) |
| Users | /#users | User management (Admin) |
| Businesses | /#businesses | Business management (Admin) |
| Profile | /profile.html | User profile & settings |
| Contact | /contact.html | Contact form |
| Documentation | /documentation.html | Help docs |

### 12.2 Design System
- **Color Scheme**: CSS variables with light/dark theme
- **Primary Color**: Accent blue (#3b82f6)
- **Typography**: System font stack
- **Components**: Cards, Badges, Modals, Toasts, Tables
- **Responsive**: Mobile-first with sidebar collapse
- **Animations**: CSS transitions, 3D tilt on landing page

### 12.3 Landing Page Special Features
- **3D Dashboard Preview**: Mouse-tracking tilt effect (±14° horizontal, ±8° vertical)
- **Scroll Progress Bar**: 3px gradient bar at top of page
- **Back-to-Top Button**: Appears after 400px scroll
- **Social Icons**: Instagram, Twitter, YouTube beside logo

---

## 13. TESTING

### 13.1 Test Coverage
| Test Suite | Tests | Status |
|-----------|-------|--------|
| auth.test.js | 9 tests | ✅ All Pass |
| invoices.test.js | 8 tests | ✅ All Pass |
| **Total** | **17 tests** | **✅ 17/17 Pass** |

### 13.2 Auth Tests
- ✅ Returns token on valid credentials
- ✅ Rejects invalid password
- ✅ Rejects missing password
- ✅ Rejects invalid email format
- ✅ Creates new user and auto-verifies in dev mode
- ✅ Rejects duplicate email
- ✅ Rejects short password
- ✅ Returns success for unknown email (forgot password)
- ✅ Returns reset token for known email

### 13.3 Invoice Tests
- ✅ Creates invoice with valid data
- ✅ Rejects invoice without required fields
- ✅ Calculates GST correctly
- ✅ Lists invoices for business
- ✅ Updates invoice status
- ✅ Deletes invoice (admin only)
- ✅ Rejects unauthorized access
- ✅ Validates GSTIN format

### 13.4 Test Command
```bash
npm test
```

---

## 14. DEPLOYMENT

### 14.1 Environment Variables
```env
PORT=3000
NODE_ENV=development | production
JWT_SECRET=<strong-secret>
SESSION_SECRET=<strong-secret>
MONGO_URI=mongodb://127.0.0.1:27017/gst_system
EMAIL_SERVICE=gmail
EMAIL_USER=your@email.com
EMAIL_PASS=app-password
APP_URL=http://localhost:3000
GROQ_API_KEY=<groq-key>
```

### 14.2 Run Commands
```bash
# Install dependencies
npm install

# Start MongoDB
net start MongoDB

# Development (auto-restart)
npm run dev

# Production
npm start

# Run tests
npm test
```

### 14.3 Default Admin Credentials
```
Email:    admin@gst.local
Password: Admin@123
```

### 14.4 CI/CD Pipeline
- GitHub Actions workflow on push to main
- Runs npm test automatically
- Fails build if any test fails

---

## 15. FUTURE SCOPE

| Feature | Priority | Description |
|---------|----------|-------------|
| GST Portal Integration | High | Direct filing via GST API |
| Mobile App | High | React Native app |
| E-Invoice (IRN) | High | Auto-generate IRN numbers |
| E-Way Bill | High | E-way bill generation |
| Multi-language | Medium | Hindi and regional languages |
| Bulk Invoice Import | Medium | CSV/Excel import |
| WhatsApp Notifications | Medium | Compliance deadline alerts |
| Advanced AI | Medium | GPT-4 powered GST advisor |
| Subscription Plans | Low | SaaS pricing tiers |
| CA/Tax Consultant Portal | Low | Dedicated CA dashboard |

---

## TEAM CONTRIBUTIONS

| Member | Contributions |
|--------|--------------|
| **Sai-Kiran** | Landing page, 3D preview, scroll effects, social icons, CI/CD pipeline, Swagger docs, Winston logging, auth fixes, dev mode auto-verify, tests |
| **Teja** | Chat system, profile page, business requests, RBAC enhancements, AI chatbot, Socket.IO, admin panel improvements |
| **Aditya** | Payment tracking, frontend JS modules, login UI, settings, chat & settings bug fixes |

---

## SUMMARY

The GST Compliance System is a production-ready, full-stack web application that solves real-world GST management challenges for Indian businesses. It combines modern web technologies with domain-specific GST knowledge to deliver a comprehensive, secure, and user-friendly platform.

**Key Numbers:**
- 17+ REST API routes
- 10+ MongoDB collections
- 17/17 tests passing
- 3 user roles
- 15+ frontend modules
- Real-time chat with Socket.IO
- AI-powered chatbot
- PDF + Excel export
- Light/Dark theme
- Fully responsive

---

*Document prepared for academic presentation — April 2026*
