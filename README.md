# tRPC-Demo

A full-stack TypeScript application demonstrating tRPC with Fastify, PostgreSQL, and React, featuring a comprehensive bearer token authentication system.

## Features

### 🔐 Authentication System
- **Bearer Token Middleware**: Complete JWT-based authentication
- **Protected Routes**: Secure API endpoints with middleware protection
- **Token Management**: Automatic token refresh and validation
- **React Integration**: Authentication context and protected components

### 🏗️ Architecture
- **Backend**: Fastify + tRPC + PostgreSQL + Drizzle ORM
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn/ui
- **Database**: PostgreSQL with sample data for coffee shop management

### 📊 Demo Application
- Coffee shop management system
- User authentication and profile management
- Interactive dashboard with real-time data
- Admin functionality with protected endpoints

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database credentials and JWT secret

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Authentication Usage

### Testing the System
1. Visit the application at `http://localhost:5173`
2. Use any email from the users table (e.g., `john.smith@email.com`) with any password
3. Navigate to the "Auth Demo" tab to test protected endpoints

### Available Test Users
- john.smith@email.com
- sarah.johnson@gmail.com
- mike.brown@yahoo.com
- emily.davis@hotmail.com
- And more in the database...

## API Endpoints

### Public Endpoints
- `GET /trpc/healthCheck` - Database health check
- `POST /trpc/auth.login` - User authentication
- `GET /trpc/public.getAllUsers` - Get all users
- `GET /trpc/public.getAllMerch` - Get all merchandise
- `GET /trpc/public.getAllCoffee` - Get all coffee items

### Protected Endpoints (Require Authentication)
- `GET /trpc/auth.me` - Get current user info
- `POST /trpc/auth.refresh` - Refresh authentication token
- `GET /trpc/protected.users.getProfile` - Get user profile
- `PUT /trpc/protected.users.updateProfile` - Update user profile
- `GET /trpc/protected.admin.getAllUsersSecure` - Admin: Get all users
- `POST /trpc/protected.admin.createUser` - Admin: Create new user

## Architecture Details

### Backend Authentication Flow
1. User sends credentials to `/trpc/auth.login`
2. Server validates user and generates JWT token
3. Client receives token and stores it securely
4. Subsequent requests include `Authorization: Bearer <token>` header
5. tRPC middleware validates token and populates context with user data

### Frontend Authentication Flow
1. `AuthProvider` manages global authentication state
2. `ProtectedRoute` components require authentication
3. `useAuth` hook provides authentication methods and state
4. tRPC client automatically includes auth headers

### Security Features
- JWT tokens with HMAC-SHA256 signatures
- Token expiration validation
- Automatic token refresh
- Secure localStorage management
- Protected route wrappers
- Comprehensive error handling

## File Structure

```
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts          # Authentication middleware
│   │   ├── db/
│   │   │   ├── index.ts         # Database connection
│   │   │   └── schema.ts        # Database schema
│   │   ├── trpc.ts              # tRPC router with auth
│   │   └── server.ts            # Fastify server
│   └── test/
│       └── auth.test.ts         # Authentication tests
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx      # Login component
│   │   │   │   ├── ProtectedRoute.tsx # Route protection
│   │   │   │   └── AuthDemo.tsx       # Demo component
│   │   │   └── ui/              # Shadcn/ui components
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # React auth context
│   │   ├── lib/
│   │   │   ├── auth.ts          # Auth utilities
│   │   │   ├── trpc.ts          # tRPC client
│   │   │   └── utils.ts         # Utility functions
│   │   └── App.tsx              # Main application
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for demonstration purposes.