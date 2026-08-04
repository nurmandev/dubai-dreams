# Dubai Dreams Showcase

Dubai Dreams Showcase is a full-stack real estate platform designed to present premium properties in Dubai through a polished public website and a powerful admin experience. The project combines an elegant frontend for visitors with a backend API for managing listings, inquiries, and administrative workflows.

## Project Overview

This application is built to serve two main audiences:

1. Visitors looking to explore luxury properties in Dubai.
2. Administrators and agents who need to manage listings, leads, and content efficiently.

The experience is designed to feel modern, premium, and easy to navigate, with rich property cards, detailed property pages, and a streamlined inquiry journey.

## What the Project Includes

### Public Website
- Beautiful property showcase pages
- Search and filtering by location, price, type, and tags
- Responsive layouts for desktop and mobile devices
- Inquiry and contact forms for potential buyers

### Admin and Management Tools
- Property management workflows
- Lead and inquiry tracking
- Content updates for listings and marketing pages
- Secure authentication and role-based access controls

### Backend Services
- REST API for property and inquiry operations
- MongoDB storage for listings and user data
- Authentication and token-based session handling
- Media and email integrations for a complete property workflow

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Framer Motion

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- JWT authentication
- Cloudinary for media handling
- Nodemailer for email communication

## Project Structure

- frontend: user interface, pages, reusable components, and styling
- backend: API routes, controllers, models, authentication, and utilities
- root project: deployment scripts, environment configuration, and workspace setup

## Local Development

### Prerequisites
- Node.js 18 or newer
- npm or pnpm
- MongoDB running locally or reachable through a connection string

### Setup Steps

```bash
# Clone the repository
git clone <your-repository-url>

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Run the app

Start the backend first:

```bash
cd backend
npm run dev
```

Then start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend will usually run at a local Vite URL such as http://localhost:5173, while the backend API runs on its configured local port.

## Environment Configuration

The backend uses environment variables for database access, JWT secrets, SMTP settings, and media integrations. A sample configuration file is included in the backend folder, and real values should be provided locally in a private .env file.

## Deployment

The frontend can be deployed to a hosting platform such as Vercel or Netlify, while the backend should be deployed to a Node-compatible server or container environment with access to MongoDB, Cloudinary, and SMTP services.

## Notes

This project was updated and documented with the latest repository changes committed on Aug 4, 2026.
