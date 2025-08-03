# Overview

This is a full-stack TypeScript application for an AI-powered game recommendation chat system. The application allows users to have conversations with GPT-4o about games, receiving personalized game suggestions with detailed information including platform, genre, ratings, and pricing. Built with React on the frontend and Express.js on the backend, it features a modern chat interface with session management and persistent conversation history.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **TanStack Query** for server state management and API communication
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with shadcn/ui components for styling and UI primitives
- **Custom gaming theme** with dark mode support and gaming-specific color schemes

## Backend Architecture
- **Express.js** server with TypeScript for the REST API
- **In-memory storage** implementation with interface abstraction for future database migration
- **OpenAI GPT-4o integration** for intelligent game recommendations and chat responses
- **Session-based chat management** with message history persistence
- **Structured data models** using Zod schemas for validation

## Database Design
- **Drizzle ORM** configured for PostgreSQL with schema definitions
- **Three main entities**: chat sessions, chat messages, and game recommendations
- **Relational structure** linking messages to sessions and recommendations to messages
- **JSON metadata storage** for flexible message data (follow-up questions, suggestion counts)
- **UUID primary keys** with timestamp tracking for all entities

## API Architecture
- **RESTful endpoints** for chat sessions and messages
- **Structured response format** with game recommendations embedded in assistant messages
- **Error handling middleware** with consistent error responses
- **Request/response logging** with performance metrics
- **CORS and security headers** properly configured

## Component Architecture
- **Modular chat components**: sidebar, message list, input, and game cards
- **Responsive design** with mobile-first approach using custom mobile detection
- **Real-time UI updates** with optimistic updates and loading states
- **Toast notifications** for user feedback and error handling
- **Accessible UI** following ARIA guidelines through Radix UI primitives

## State Management
- **Server state** managed by TanStack Query with automatic caching and synchronization
- **Local UI state** using React hooks for component-specific state
- **Session management** with current session tracking and automatic updates
- **Error boundaries** and graceful error handling throughout the application

## External Dependencies

### AI Service Integration
- **OpenAI GPT-4o API** for generating personalized game recommendations
- **Structured prompting system** ensuring consistent JSON responses with game details
- **Context-aware conversations** maintaining chat history for better recommendations

### Database Service
- **Neon Database** (PostgreSQL) for production data persistence
- **Connection pooling** through Neon's serverless driver
- **Migration system** using Drizzle Kit for schema management

### UI and Styling
- **Radix UI** primitives for accessible, unstyled components
- **Lucide React** for consistent iconography
- **Tailwind CSS** for utility-first styling
- **Custom CSS variables** for theming and dark mode support

### Development Tools
- **Replit integration** with development banner and error overlay
- **TypeScript** for type safety across the entire stack
- **ESBuild** for production bundling and optimization
- **PostCSS** with Autoprefixer for CSS processing

### Runtime Environment
- **Node.js** ES modules with top-level await support
- **Environment variable management** for API keys and database URLs
- **Development and production build scripts** with different optimization levels