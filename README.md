# Velocity - Task Management Application

![Velocity Logo](./client/public/logo.png)

## 🚀 Overview

Velocity is a production-grade task management application designed for remote collaboration. It features user authentication, role-based access control, dynamic UI components, and full AWS cloud deployment.

## ✨ Features

- **User Authentication**: Secure login and registration with AWS Cognito
- **Project Management**: Create, update, and track projects with multiple views
- **Task Tracking**: Manage tasks with priorities, statuses, and assignments
- **Team Collaboration**: Organize users into teams with specific roles
- **Multiple Views**: Board, List, Table, and Timeline views for projects
- **Role-Based Access**: Different permissions for admins and standard users
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js + Tailwind CSS | UI components, routing, responsive styling |
| Backend | Node.js + Express + Prisma ORM | Server logic, API integration, DB access |
| Database | PostgreSQL via AWS RDS | Storing user data, tasks, and project info |
| Authentication | AWS Cognito | Secure login, user pools, token validation |
| Hosting | AWS EC2 | Hosting the backend Node server |
| State Management | Redux | Client-side state management |
| Process Management | PM2 | Node.js process management in production |

## 📋 Project Structure

```
velocity/
├── client/                 # Frontend Next.js application
│   ├── public/             # Static assets
│   └── src/
│       ├── app/            # Next.js app router pages
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions
│       └── state/          # Redux state management
│
└── server/                 # Backend Node.js application
    ├── prisma/             # Database schema and migrations
    │   ├── migrations/     # Database migration files
    │   └── schema.prisma   # Prisma schema definition
    └── src/
        ├── controllers/    # API controllers
        ├── routes/         # API route definitions
        └── index.ts        # Server entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database
- AWS account (for Cognito and RDS)

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-cognito-user-pool-id
   NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your-cognito-client-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/velocity
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 AWS Deployment

### Database (RDS)

1. Create a PostgreSQL RDS instance in AWS
2. Configure security groups to allow access from your EC2 instance
3. Update your server's `.env` file with the RDS connection string

### Authentication (Cognito)

1. Create a User Pool in AWS Cognito
2. Configure app client settings
3. Update your client's `.env.local` file with Cognito credentials

### Backend (EC2)

1. Launch an EC2 instance with Amazon Linux 2
2. Follow the deployment instructions in `server/aws-ec2-instructions.md`
3. Configure security groups to allow HTTP/HTTPS traffic

## 📊 Data Model

The application uses the following core entities:

- **User**: Application users with authentication details
- **Team**: Groups of users working together
- **Project**: Container for tasks with metadata
- **Task**: Individual work items with status, priority, and assignments
- **Comment**: User comments on tasks
- **Attachment**: Files attached to tasks

## 🔒 Security Features

- JWT-based authentication with AWS Cognito
- Secure password handling
- HTTPS for all communications
- Environment variables for sensitive information
- Cross-Origin Resource Policy implementation

## 👥 Contributors

- [Harsh Patel](https://github.com/harsh260105)
- [Hemax Patel](https://github.com/hemaxpatel)
- [Het Patel](https://github.com/hetpatel203)

---

Built with ❤️ using Next.js, Node.js, and AWS
