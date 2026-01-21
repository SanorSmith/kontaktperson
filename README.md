# Kontaktperson Platform - Sweden Map

## 🌐 Live Demo
🔗 **Live Application**: [https://sweden-map-dusky.vercel.app/](https://sweden-map-dusky.vercel.app/)

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Database Setup](#-database-setup)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

The Kontaktperson Platform is a comprehensive web application designed to connect volunteers with social services across Sweden. This platform features an interactive map interface, role-based authentication, and a robust backend built with modern web technologies.

**Key Purpose**: 
- Facilitate connections between volunteers and social workers
- Provide geographical visualization of volunteer coverage across Sweden
- Enable efficient management of contact person relationships
- Support multiple user roles with appropriate access controls

## ✨ Features

### User Features
- **Interactive Sweden Map**: Visual representation of volunteer coverage using Leaflet
- **Multi-Role Authentication**: Support for Admin, Social Worker, and Volunteer roles
- **Role-Based Dashboards**: Customized interfaces for each user type
- **Volunteer Registration**: Comprehensive onboarding process for new volunteers
- **Search & Discovery**: Find volunteers by location and availability
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Technical Features
- **Progressive Web App**: Modern web standards with offline capabilities
- **Real-time Updates**: Live data synchronization with Supabase
- **Type Safety**: Full TypeScript implementation
- **Middleware Authentication**: Route protection with Next.js middleware
- **Email Notifications**: Automated emails using Resend
- **Database Seeding**: Automated volunteer data generation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.35 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Lucide React 0.263.1
- **Maps**: Leaflet 1.9.4 + React Leaflet 4.2.1
- **Charts**: Recharts 2.10.0

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **API**: Next.js API Routes
- **Email**: Resend 6.7.0

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 8 with Next.js config
- **Environment**: dotenv 17.2.3
- **Type Checking**: TypeScript 5
- **Build Tool**: Next.js built-in

### Deployment
- **Platform**: Vercel
- **Environment Variables**: Secure configuration management
- **CI/CD**: Automated deployment on git push

## 🏗️ Architecture

### Application Structure
```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── for-volontarer/    # Volunteer information page
│   ├── for-socialsekreterare/ # Social worker info
│   ├── login/             # Authentication
│   ├── registrera/        # Registration
│   ├── social-worker/     # Social worker dashboard
│   └── volunteer/         # Volunteer dashboard
├── lib/                   # Shared utilities
├── scripts/               # Database and admin scripts
└── public/               # Static assets
```

### Authentication Flow
1. **Middleware**: Route protection based on user roles
2. **Supabase Auth**: JWT-based authentication
3. **Role Management**: Three-tier access control (Admin, Social Worker, Volunteer)
4. **Redirect Logic**: Automatic redirection to appropriate dashboards

### Database Schema
- **Users**: Authentication and profile management
- **Volunteers**: Volunteer-specific information and availability
- **Admin**: Administrative user management
- **Social Workers**: Professional user accounts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend account (for emails)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sweden-map
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Configure Environment Variables**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Email Service
RESEND_API_KEY=re_your-api-key-here

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Database Setup**
```bash
# Run database setup scripts
npm run create-admin
```

## 💻 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run create-admin # Create admin user
```

### Project Structure
- **App Router**: Modern Next.js routing with React Server Components
- **Middleware**: Authentication and route protection
- **API Routes**: RESTful endpoints for data operations
- **Components**: Modular, reusable React components
- **TypeScript**: Full type safety across the application

### Environment Variables
- `.env.local`: Local development configuration
- `.env.example`: Template for required variables
- **Security**: Never commit sensitive environment variables

## 🗄️ Database Setup

### Supabase Configuration
1. Create a new Supabase project
2. Run the provided SQL scripts in order:
   - `setup-database-v2.sql`
   - `fix-rls-policies.sql`
   - `add-missing-columns.sql`

### Database Scripts
- **setup-database-v2.sql**: Complete database schema
- **seed-volunteers.ts**: Generate sample volunteer data
- **create-admin.ts**: Create administrative users
- **fix-*.sql**: Database migration and fixes

## 🚢 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Configure all required environment variables
3. **Automatic Deployment**: Deploy automatically on push to main branch

### Production Checklist
- [ ] Environment variables configured
- [ ] Database policies set up
- [ ] Admin users created
- [ ] Email service configured
- [ ] Domain configured (if custom)

## 📖 API Documentation

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

#### Volunteers
- `GET /api/volunteers` - List volunteers
- `POST /api/volunteers` - Create volunteer
- `PUT /api/volunteers/[id]` - Update volunteer

#### Admin
- `GET /api/admin/users` - List all users
- `POST /api/admin/create-user` - Create new user

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

## 🔒 Security

### Authentication & Authorization
- **JWT Tokens**: Supabase-based authentication
- **Role-Based Access**: Middleware-enforced route protection
- **API Security**: Service role key for admin operations
- **Environment Variables**: Secure configuration management

### Data Protection
- **Row Level Security**: Database-level access controls
- **Input Validation**: Type-safe API endpoints
- **HTTPS Only**: Production deployment with SSL
- **Environment Isolation**: Separate dev/prod configurations

## 📊 Monitoring & Performance

### Key Metrics
- **Lighthouse Score**: Optimized for performance
- **Core Web Vitals**: Fast loading and interaction
- **Bundle Size**: Optimized with Next.js optimizations
- **Database Performance**: Efficient queries with Supabase

### Performance Features
- **Dynamic Imports**: Code splitting with React.lazy
- **Image Optimization**: Next.js Image component
- **Caching**: Supabase and browser caching strategies
- **CDN**: Vercel's global CDN distribution

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Add tests if applicable
5. Submit a pull request

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Consistent code formatting
- **Components**: Modular and reusable

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Developed as a comprehensive platform for connecting volunteers with social services across Sweden.

## 🙏 Acknowledgments

- **Supabase**: Backend and authentication services
- **Vercel**: Hosting and deployment platform
- **Next.js**: React framework and tooling
- **Leaflet**: Interactive mapping library
- **Tailwind CSS**: Utility-first CSS framework

## 📸 Screenshots

### Main Interface
- Interactive Sweden map with volunteer coverage visualization
- Responsive navigation with role-based menu options
- Clean, modern UI design with Swedish localization

### Dashboard Features
- Admin dashboard with user management
- Social worker dashboard with volunteer search
- Volunteer dashboard with profile management

---

**Note**: This application is designed specifically for the Swedish social services ecosystem and includes Swedish language support throughout the interface.
