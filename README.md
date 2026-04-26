# GST Compliance & Transaction Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%3E%3D4.4-green)](https://www.mongodb.com/)

A comprehensive, enterprise-grade GST (Goods and Services Tax) compliance and transaction management system designed for Indian businesses. Built with modern web technologies to streamline GST filing, invoice management, and compliance tracking.

## 🌟 Overview

The GST Compliance System is a full-stack web application that helps businesses manage their GST obligations efficiently. It provides end-to-end functionality for invoice generation, GST return preparation, compliance tracking, and financial analytics—all in one integrated platform.

## ✨ Key Features

### Core Functionality

#### 📊 **Dashboard & Analytics**
- Real-time business insights and KPI tracking
- Visual charts for sales trends, tax analysis, and revenue metrics
- Monthly and yearly financial summaries
- Top customer analysis and supply type breakdowns
- Compliance calendar with upcoming deadlines

#### 🧾 **Invoice Management**
- Create, edit, and manage sales invoices (B2B, B2C, B2G)
- Automatic GST calculation (CGST, SGST, IGST)
- Support for intra-state and inter-state supplies
- Invoice confirmation with IRN (Invoice Reference Number) generation
- PDF export with professional formatting
- Excel export for bulk data analysis
- Multi-item invoices with HSN/SAC codes
- Discount and cess support
- TDS/TCS integration

#### 💼 **Purchase Management**
- Record and track purchase invoices
- ITC (Input Tax Credit) eligibility tracking
- GSTR-2A/2B reconciliation support
- Supplier invoice matching
- Payment status tracking

#### 📋 **GST Returns**
- Automated GSTR-1 preparation (outward supplies)
- Automated GSTR-3B preparation (summary return)
- GSTR-9 (annual return) support
- Period-wise return generation
- Filing status tracking with ARN
- JSON export for GST portal upload

#### 👥 **Party Management**
- Comprehensive customer and vendor database
- GSTIN validation and verification
- PAN extraction from GSTIN
- State code identification
- Contact information management
- Party type classification (customer/supplier/both)

#### 🔍 **HSN/SAC Lookup**
- Built-in HSN (Harmonized System of Nomenclature) code database
- SAC (Services Accounting Code) support
- Quick search functionality
- GST rate suggestions based on HSN/SAC
- Cess rate information

#### 📅 **Compliance Calendar**
- Automatic deadline tracking for all GST returns
- Overdue filing alerts
- Upcoming compliance notifications
- Period-wise compliance status
- Email and browser notifications

#### 💰 **TDS/TCS Management**
- TDS (Tax Deducted at Source) entry and tracking
- TCS (Tax Collected at Source) management
- Section-wise categorization
- Period-wise summaries
- Base amount and rate calculations

#### 🔄 **Reconciliation**
- Match purchase invoices with GSTR-2A/2B data
- Identify mismatches and missing entries
- ITC reconciliation reports
- Supplier-wise reconciliation

#### 📤 **Export & Reports**
- PDF invoice generation with company branding
- Excel export for invoices, purchases, and returns
- Dashboard summary reports
- Custom date range reports
- Multi-format support (PDF, Excel)

### Advanced Features

#### 🔐 **Authentication & Security**
- JWT-based authentication with 30-minute token expiry
- Role-based access control (RBAC)
  - **Admin**: Full system access, user management, business creation
  - **Accountant**: Invoice and return management, analytics access
  - **Viewer**: Read-only access to reports and data
- Password encryption with bcrypt
- OAuth 2.0 integration (Google, Facebook, GitHub)
- Email verification for new accounts
- Password reset functionality
- Session management and automatic logout

#### 🏢 **Multi-Business Support**
- Manage multiple GSTINs from a single account
- Business-level data isolation
- User-to-business assignment by admins
- Quick business switching for accountants
- Business access request workflow

#### 💬 **Real-Time Chat System**
- User-to-admin messaging with Socket.IO
- AI-powered chatbot for GST queries (Groq LLM integration)
- Unread message badges
- Typing indicators
- Message history
- Admin dashboard for managing conversations
- Automatic bot responses when admin is offline

#### 🎫 **Support Ticket System**
- Create and track support tickets
- Priority levels (low, medium, high)
- Status tracking (open, in progress, resolved, closed)
- Admin reply system
- Ticket history and conversation threads
- Public contact form for non-registered users

#### 📊 **Business Request Management**
- Users can request access to businesses
- Admin approval workflow
- Request status tracking (pending, approved, rejected)
- Admin notes and comments
- Real-time notifications for new requests

#### 🎨 **User Experience**
- Modern, responsive UI design
- Light and dark theme support
- Mobile-friendly interface
- Intuitive navigation with sidebar and topbar
- Real-time notifications
- Toast messages for user feedback
- Loading states and error handling

#### 👤 **Profile Management**
- Comprehensive user profile dashboard
- Personal information editing
- Password change functionality
- Business assignment view
- Theme and currency preferences
- Account settings
- Logout functionality

#### 🔍 **Audit Trail**
- Complete activity logging
- User action tracking
- Entity-level change history
- IP address logging
- Timestamp tracking
- Admin audit reports

#### 🌐 **Multi-Currency Support**
- INR (Indian Rupee)
- USD (US Dollar)
- EUR (Euro)
- Real-time currency conversion
- User-specific currency preferences

#### 📧 **Email Notifications**
- Account verification emails
- Password reset emails
- Compliance deadline reminders
- System notifications
- Gmail integration with app passwords

#### 📖 **API Documentation**
- Interactive Swagger UI documentation
- Complete API endpoint reference
- Request/response examples
- Authentication details
- Available at `/api-docs`

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), Passport.js
- **Real-Time**: Socket.IO
- **Security**: Helmet, bcrypt, express-rate-limit
- **Validation**: express-validator
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **Excel Export**: ExcelJS
- **AI Integration**: Groq SDK (LLaMA 3)
- **Logging**: Winston with daily log rotation
- **Scheduling**: node-cron
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)

### Frontend
- **Core**: Vanilla JavaScript (ES6+)
- **Architecture**: Single Page Application (SPA) with hash routing
- **Styling**: Custom CSS with CSS variables for theming
- **Charts**: Chart.js
- **Real-Time**: Socket.IO client
- **HTTP Client**: Fetch API
- **State Management**: Custom application state

### Development Tools
- **Testing**: Jest, Supertest
- **Development Server**: Nodemon
- **Version Control**: Git
- **Package Manager**: npm

## 📋 Prerequisites

Before installation, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)
- **npm** (comes with Node.js)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/codewithsaiteja/GST-COMPLIANCE-SYSTEM.git
cd GST-COMPLIANCE-SYSTEM
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_strong_jwt_secret_here_min_32_characters
JWT_EXPIRES_IN=30m

# Session Configuration
SESSION_SECRET=your_strong_session_secret_here

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/gst_system

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
APP_URL=http://localhost:3000

# Security
BCRYPT_ROUNDS=10

# AI Configuration (Optional - for chatbot)
GROQ_API_KEY=your_groq_api_key_here

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

#### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this 16-character password in `EMAIL_PASS`

#### Groq API Key (Optional)

1. Sign up at [Groq Console](https://console.groq.com/)
2. Generate an API key
3. Add it to `GROQ_API_KEY` for AI chatbot functionality

### 4. Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Compass** to start a local instance.

### 5. Run the Application

**Development Mode** (with auto-restart):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🔑 Default Credentials

**Administrator Account:**
- **Email**: `admin@gst.local`
- **Password**: `Admin@123`

**Important**: Change the default password immediately after first login.

## 📁 Project Structure

```
gst-compliance-system/
├── backend/
│   ├── middleware/
│   │   ├── auth.js              # Authentication & RBAC middleware
│   │   └── validate.js          # Request validation middleware
│   ├── models/
│   │   ├── BusinessRequest.js   # Business access request model
│   │   ├── Chat.js              # Chat message model
│   │   ├── Conversation.js      # Conversation model
│   │   ├── Message.js           # Message model
│   │   └── Ticket.js            # Support ticket model
│   ├── routes/
│   │   ├── analytics.js         # Analytics & dashboard endpoints
│   │   ├── audit.js             # Audit trail endpoints
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── business-requests.js # Business request endpoints
│   │   ├── businesses.js        # Business management endpoints
│   │   ├── chat.js              # Chat system endpoints
│   │   ├── compliance.js        # Compliance calendar endpoints
│   │   ├── export.js            # PDF/Excel export endpoints
│   │   ├── hsn.js               # HSN/SAC lookup endpoints
│   │   ├── invoices.js          # Invoice management endpoints
│   │   ├── parties.js           # Party management endpoints
│   │   ├── payments.js          # Payment tracking endpoints
│   │   ├── purchases.js         # Purchase management endpoints
│   │   ├── reconcile.js         # Reconciliation endpoints
│   │   ├── returns.js           # GST returns endpoints
│   │   ├── tds.js               # TDS/TCS endpoints
│   │   ├── tickets.js           # Support ticket endpoints
│   │   └── users.js             # User management endpoints
│   ├── utils/
│   │   ├── ai.js                # AI chatbot integration (Groq)
│   │   ├── compliance.js        # Compliance calculations
│   │   ├── db.js                # Database connection & models
│   │   ├── gst.js               # GST calculation utilities
│   │   ├── logger.js            # Winston logger configuration
│   │   ├── mailer.js            # Email service
│   │   ├── passport.js          # OAuth strategies
│   │   ├── seedData.js          # Database seeding
│   │   ├── swagger.js           # API documentation config
│   │   └── validateEnv.js       # Environment validation
│   ├── server.js                # Main server file
│   └── users.json               # User data backup
├── frontend/
│   └── html/
│       ├── contact.html         # Contact page
│       ├── demo-3d.html         # 3D demo page
│       ├── documentation.html   # Documentation page
│       ├── index.html           # Main application (SPA)
│       ├── landing.html         # Landing page
│       ├── privacy.html         # Privacy policy
│       ├── profile.html         # Profile page template
│       ├── support.html         # Support page
│       └── terms.html           # Terms of service
├── css/
│   ├── chat-new.css             # Chat system styles
│   ├── chat.css                 # Legacy chat styles
│   ├── landing.css              # Landing page styles
│   ├── profile.css              # Profile page styles
│   └── style.css                # Main application styles
├── js/
│   ├── admin-pages.js           # Admin-specific pages
│   ├── app.js                   # Core application logic
│   ├── business-requests.js     # Business request UI
│   ├── chat-new.js              # Chat system UI
│   ├── chat.js                  # Legacy chat UI
│   ├── extra-pages.js           # Additional pages
│   ├── invoices.js              # Invoice management UI
│   ├── landing.js               # Landing page logic
│   ├── more-pages.js            # More page handlers
│   ├── pages.js                 # Page routing
│   ├── payments-page.js         # Payment tracking UI
│   └── profile.js               # Profile page logic
├── logs/                        # Application logs (auto-generated)
├── tests/
│   ├── auth.test.js             # Authentication tests
│   └── invoices.test.js         # Invoice tests
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── .npmrc                       # npm configuration
├── package.json                 # Dependencies & scripts
├── package-lock.json            # Dependency lock file
└── README.md                    # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth
- `GET /api/auth/github` - GitHub OAuth

### Businesses
- `GET /api/businesses` - List businesses (admin)
- `POST /api/businesses` - Create business (admin)
- `GET /api/businesses/:id` - Get business details
- `PUT /api/businesses/:id` - Update business (admin)
- `DELETE /api/businesses/:id` - Delete business (admin)

### Business Requests
- `POST /api/business-requests/request` - Request business access
- `GET /api/business-requests/my-requests` - Get user's requests
- `GET /api/business-requests/pending-status` - Check pending status
- `GET /api/business-requests/all` - Get all requests (admin)
- `POST /api/business-requests/approve/:id` - Approve request (admin)
- `POST /api/business-requests/reject/:id` - Reject request (admin)
- `GET /api/business-requests/stats` - Get request statistics (admin)

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PATCH /api/invoices/:id/confirm` - Confirm invoice
- `PATCH /api/invoices/:id/cancel` - Cancel invoice

### Purchases
- `GET /api/purchases` - List purchases
- `POST /api/purchases` - Create purchase
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Parties
- `GET /api/parties` - List parties
- `POST /api/parties` - Create party
- `GET /api/parties/:id` - Get party details
- `PUT /api/parties/:id` - Update party
- `DELETE /api/parties/:id` - Delete party
- `GET /api/parties/validate/:gstin` - Validate GSTIN

### GST Returns
- `GET /api/returns` - List returns
- `POST /api/returns/prepare` - Prepare return
- `PATCH /api/returns/:id/file` - File return

### Compliance
- `GET /api/compliance` - List compliance items
- `PATCH /api/compliance/:id/filed` - Mark as filed

### HSN/SAC
- `GET /api/hsn` - Search HSN/SAC codes
- `GET /api/hsn/rate/:code` - Get GST rate for code

### TDS/TCS
- `GET /api/tds` - List TDS/TCS entries
- `POST /api/tds` - Create TDS/TCS entry
- `GET /api/tds/summary` - Get TDS/TCS summary
- `DELETE /api/tds/:id` - Delete entry

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/tax-trend` - Tax trend analysis
- `GET /api/analytics/itc-summary` - ITC summary

### Export
- `GET /api/export/invoice/:id/pdf` - Export invoice as PDF
- `GET /api/export/invoices/excel` - Export invoices as Excel
- `GET /api/export/dashboard-report` - Export dashboard report

### Chat
- `GET /api/chat/rooms` - Get all chat rooms (admin)
- `GET /api/chat/:room` - Get chat history
- `POST /api/chat/send` - Send message
- `GET /api/chat/conversations` - Get conversations
- `GET /api/chat/messages/:id` - Get messages

### Tickets
- `POST /api/tickets/contact` - Public contact form
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - Get all tickets (admin)
- `GET /api/tickets/my` - Get user's tickets
- `GET /api/tickets/:id` - Get ticket details
- `PATCH /api/tickets/:id/status` - Update ticket status (admin)
- `POST /api/tickets/:id/reply` - Reply to ticket (admin)

### Users (Admin)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Audit (Admin)
- `GET /api/audit` - Get audit logs

### API Documentation
- `GET /api-docs` - Interactive Swagger UI

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run specific test file:

```bash
npm test -- tests/auth.test.js
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with 30-minute expiry
- **Password Hashing**: bcrypt with 10 rounds
- **Rate Limiting**: 500 requests per 15 minutes per IP
- **Helmet.js**: Security headers
- **Input Validation**: express-validator for all inputs
- **XSS Protection**: HTML escaping for user inputs
- **CORS**: Configured for secure cross-origin requests
- **Business-Level Access Control**: Users can only access assigned businesses
- **Audit Logging**: Complete activity tracking
- **Environment Validation**: Required variables checked on startup

## 🎨 Themes

The application supports two themes:
- **Light Mode**: Clean, professional light theme
- **Dark Mode**: Eye-friendly dark theme

Users can switch themes from the profile settings or topbar.

## 💱 Currency Support

Supported currencies:
- **INR** (Indian Rupee) - Default
- **USD** (US Dollar)
- **EUR** (Euro)

Currency preference is saved per user and persists across sessions.

## 📊 Database Schema

### Collections

- **users**: User accounts and authentication
- **businesses**: Business/GSTIN registrations
- **userbusinesses**: User-to-business assignments
- **parties**: Customers and suppliers
- **invoices**: Sales invoices
- **invoiceitems**: Invoice line items
- **purchases**: Purchase invoices
- **returns**: GST returns (GSTR-1, GSTR-3B, GSTR-9)
- **hsns**: HSN/SAC code master data
- **compliances**: Compliance calendar entries
- **auditlogs**: Activity audit trail
- **tdstcs**: TDS/TCS entries
- **chats**: Chat messages
- **conversations**: Chat conversations
- **messages**: Conversation messages
- **tickets**: Support tickets
- **businessrequests**: Business access requests

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set strong `JWT_SECRET` (min 32 characters)
   - Set strong `SESSION_SECRET`
   - Configure production `MONGO_URI`
   - Set up email service credentials
   - Update `APP_URL` to production domain
   - Set `NODE_ENV=production`

2. **Database**
   - Set up MongoDB replica set for high availability
   - Configure automated backups
   - Add indexes for performance
   - Enable authentication

3. **Security**
   - Enable HTTPS/SSL
   - Configure firewall rules
   - Set up rate limiting
   - Enable CORS for specific domains only
   - Regular security audits

4. **Monitoring**
   - Set up error logging (Winston logs to files)
   - Monitor API performance
   - Track user activity
   - Set up uptime monitoring

5. **Performance**
   - Enable compression (already configured)
   - Use CDN for static assets
   - Optimize database queries
   - Implement caching where appropriate

### Deployment Platforms

The application can be deployed on:
- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS**: EC2 + MongoDB Atlas or DocumentDB
- **DigitalOcean**: Droplet + Managed MongoDB
- **Azure**: App Service + Cosmos DB
- **Google Cloud**: App Engine + Cloud MongoDB

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues

- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Ensure MongoDB port (27017) is not blocked
- Check MongoDB logs for errors

### Email Not Sending

- Verify Gmail app password is correct
- Check 2FA is enabled on Google account
- Ensure `EMAIL_USER` and `EMAIL_PASS` are set
- Check spam folder for test emails

### Session Expiry

- Tokens expire after 30 minutes by default
- Users need to re-login after expiry
- Consider implementing refresh tokens for better UX

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions:

- **Email**: admin@gst.local
- **GitHub Issues**: [Create an issue](https://github.com/codewithsaiteja/GST-COMPLIANCE-SYSTEM/issues)
- **Documentation**: Available at `/documentation.html` when running the app

## 🙏 Acknowledgments

- Built with ❤️ for Indian businesses
- GST rates and HSN codes based on official GST Council notifications
- Icons and UI inspiration from modern design systems
- Community feedback and contributions

## 📚 Additional Resources

- [GST Official Portal](https://www.gst.gov.in/)
- [GST Council](https://gstcouncil.gov.in/)
- [HSN Code Search](https://www.gst.gov.in/help/hsnsac)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Version**: 2.0.0  
**Last Updated**: April 2026  
**Maintained by**: Sai Teja

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
