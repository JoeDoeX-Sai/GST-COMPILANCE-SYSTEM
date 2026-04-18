# GST Compliance System

A comprehensive GST (Goods and Services Tax) compliance and transaction management system built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

### Core Functionality
- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Accountant, Viewer)
- **Business Management**: Multi-business support with user assignment
- **Invoice Management**: Sales and purchase invoice tracking with GST calculations
- **GST Returns**: Automated GST return preparation and filing
- **Compliance Calendar**: Track filing deadlines and compliance requirements
- **Reconciliation**: Match invoices with GST portal data
- **Analytics Dashboard**: Visual insights into GST data and trends
- **Party Management**: Customer and vendor database
- **HSN/SAC Lookup**: Product and service classification codes

### Additional Features
- **Real-time Chat**: User-to-admin messaging system with Socket.io
- **AI Chatbot**: Intelligent assistant for GST queries (user mode only)
- **Profile Management**: Full dashboard-style profile page with settings
- **Audit Trail**: Complete activity logging for compliance
- **Multi-currency Support**: INR, USD, EUR
- **Theme Support**: Light and dark mode
- **Responsive Design**: Mobile-friendly interface
- **Email Notifications**: Automated alerts and reminders

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Security**: Helmet, bcrypt, express-rate-limit
- **Validation**: express-validator
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **Excel Export**: ExcelJS
- **AI Integration**: Groq SDK

### Frontend
- **Core**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS variables
- **Charts**: Chart.js
- **Real-time**: Socket.io client
- **Architecture**: SPA (Single Page Application) with hash routing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd gst-compliance-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=30m
NODE_ENV=development
BCRYPT_ROUNDS=10
SESSION_SECRET=your_session_secret_here

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/gst_system

# Email (Gmail App Password)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
APP_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. **Run the application**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

6. **Access the application**
```
http://localhost:3000
```

## Default Credentials

**Admin Account**:
- Email: `admin@gst.local`
- Password: `Admin@123`

## Project Structure

```
gst-compliance-system/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # Authentication & RBAC middleware
│   │   └── validate.js      # Request validation
│   ├── models/
│   │   ├── Chat.js          # Chat models (Conversation, Message)
│   │   ├── Ticket.js        # Support ticket model
│   │   └── ...              # Other models
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── businesses.js    # Business management
│   │   ├── chat.js          # Chat system
│   │   ├── invoices.js      # Invoice management
│   │   ├── returns.js       # GST returns
│   │   └── ...              # Other routes
│   ├── utils/
│   │   ├── ai.js            # AI chatbot integration
│   │   ├── compliance.js    # Compliance calculations
│   │   ├── db.js            # Database connection & models
│   │   ├── gst.js           # GST calculations
│   │   ├── mailer.js        # Email service
│   │   └── passport.js      # OAuth strategies
│   └── server.js            # Main server file
├── frontend/
│   ├── css/
│   │   ├── style.css        # Main styles
│   │   ├── chat-new.css     # Chat system styles
│   │   └── profile.css      # Profile page styles
│   ├── html/
│   │   ├── index.html       # Main SPA container
│   │   ├── profile.html     # Profile page template
│   │   └── ...              # Other page templates
│   └── js/
│       ├── app.js           # Core application logic
│       ├── pages.js         # Page routing
│       ├── profile.js       # Profile page logic
│       ├── chat-new.js      # Chat system
│       ├── invoices.js      # Invoice management
│       └── ...              # Other page scripts
├── data/
│   └── gst_system.db        # SQLite backup (optional)
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── README.md                # This file
```

## Key Features Explained

### Role-Based Access Control (RBAC)

**Admin**:
- Full system access
- Create and manage businesses
- Assign users to businesses
- Access audit trail
- Manage all users
- View all data

**Accountant**:
- Access assigned businesses
- Create and manage invoices
- Prepare GST returns
- View analytics
- Limited settings access

**Viewer**:
- Read-only access
- View reports and analytics
- No data modification

### Profile Page

Full dashboard-style profile page with:
- **Profile Tab**: Update personal information
- **Password Tab**: Change password with validation
- **GST Tab**: View and switch between assigned businesses
- **Settings Tab**: Theme, currency, account info, logout

### Chat System

- **User Mode**: Chat with admin support, AI chatbot assistance
- **Admin Mode**: View all conversations, respond to users, manage tickets
- **Real-time**: Instant message delivery with Socket.io
- **Unread Badges**: Track unread messages

### Security Features

- JWT authentication with 30-minute expiration
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet.js security headers
- Input validation and sanitization
- Business-level access control
- Audit logging for all actions

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Businesses
- `GET /api/businesses` - List businesses (admin)
- `POST /api/businesses` - Create business (admin)
- `PUT /api/businesses/:id` - Update business (admin)
- `DELETE /api/businesses/:id` - Delete business (admin)

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Chat
- `POST /api/chat/send` - Send message
- `GET /api/chat/conversations` - Get conversations
- `GET /api/chat/messages/:id` - Get messages

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/trends` - Trend analysis

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Database Seeding

The system automatically creates an admin user on first run:
- Email: admin@gst.local
- Password: Admin@123

### Testing

Manual testing checklist:
1. Authentication (login, logout, session expiry)
2. RBAC (admin vs user access)
3. Business assignment flow
4. Invoice creation and GST calculation
5. Chat system (user-admin messaging)
6. Profile page (all tabs)
7. Settings (theme, currency)

## Deployment

### Production Checklist

1. **Environment Variables**
   - Set strong JWT_SECRET
   - Configure production MongoDB URI
   - Set up email service
   - Update APP_URL

2. **Security**
   - Enable HTTPS
   - Set NODE_ENV=production
   - Configure CORS properly
   - Set up rate limiting

3. **Database**
   - Set up MongoDB replica set
   - Configure backups
   - Add indexes for performance

4. **Monitoring**
   - Set up error logging
   - Monitor API performance
   - Track user activity

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues
- Verify MongoDB is running
- Check MONGO_URI in .env
- Ensure MongoDB port (27017) is not blocked

### Session Expiry
- Tokens expire after 30 minutes
- Users need to re-login
- Consider implementing refresh tokens for better UX

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For issues or questions:
- Create an issue in the repository
- Contact: admin@gst.local

## Changelog

### Version 2.0.0 (Current)
- ✅ Full profile dashboard page
- ✅ Real-time chat system
- ✅ AI chatbot integration
- ✅ Settings tab with logout
- ✅ Token expiration (30 minutes)
- ✅ Improved RBAC
- ✅ Responsive design
- ✅ Theme support (light/dark)
- ✅ Multi-currency support

### Version 1.0.0
- Initial release
- Basic GST compliance features
- Invoice management
- User authentication

---

**Built with ❤️ for GST Compliance**
