# Dubai Dreams Showcase

Dubai Dreams Showcase is a full-stack real estate platform designed to present premium properties in Dubai through a polished public-facing website and a powerful admin experience. The project combines an elegant frontend for visitors with a robust backend API for managing property listings, inquiries, users, content, and administrative workflows.

## Project Overview

This application serves two main audiences:

1. Visitors who want to explore luxury properties in Dubai, browse listings, and request more information.
2. Administrators, agents, and internal staff who need to manage listings, leads, content, and account access efficiently.

The experience is built to feel premium, modern, and intuitive, with rich listing cards, detailed property pages, interactive search filters, and a smooth inquiry flow that helps convert interest into leads.

## What the Project Includes

### Public Website

- Beautiful property showcase pages for luxury real estate listings
- Search and filtering by location, price, property type, and tags
- Responsive design for desktop, tablet, and mobile devices
- Inquiry and contact forms for potential buyers and investors
- Content-rich landing pages and marketing sections for brand presentation

### Admin and Management Tools

- Property management workflows for creating, editing, and publishing listings
- Lead and inquiry tracking for incoming buyer interest
- Content updates for listings, pages, and promotional sections
- Secure authentication with role-based access controls for staff and administrators
- Dashboard-oriented workflows for content and user management

### Backend Services

- REST API for property, inquiry, user, and admin operations
- MongoDB storage for listings, accounts, and application data
- Authentication and token-based session handling for secure access
- Email integration for user communication and inquiry notifications
- Media handling through Cloudinary for property images, videos, and documents

## Core Business Goals

Dubai Dreams Showcase is more than a simple demo website. It is structured to function like a real estate platform that can support:

- Premium property presentation for buyers and investors
- Lead generation through inquiry forms and CRM-style workflows
- Streamlined internal operations for property and content management
- Scalable backend services that can grow with future features and integrations

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

- frontend: user interface, pages, reusable components, styling, and client-side logic
- backend: API routes, controllers, models, authentication, validation, and utilities
- root project: deployment scripts, environment configuration, and workspace setup

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm or pnpm
- MongoDB running locally or reachable through a valid connection string

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/nurmandev/dubai-dream

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Run the application

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

The backend relies on environment variables for database access, JWT secrets, SMTP settings, and media integrations. A sample configuration file is included in the backend folder, and real values should be provided locally in a private .env file.

## Deployment

The frontend can be deployed to a hosting platform such as Vercel or Netlify, while the backend should be deployed to a Node-compatible server or container environment with access to MongoDB, Cloudinary, and SMTP services.

## Notes

This project was updated and documented with the latest repository changes and is intended to serve as a complete showcase for a modern Dubai real estate platform.
