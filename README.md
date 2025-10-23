# Let's Share

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red?logo=sqlalchemy&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State%20Management-orange)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-0081CB?logo=mui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP%20Client-5A29E4?logo=axios&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-Migrations-yellowgreen)

A demonstration of **professional-grade full-stack development** with clean architecture, proper separation of concerns, and robust data access layers.

## Architecture Overview

This project showcases **enterprise-level code organization** and **best practices** across the full stack, prioritizing maintainable, scalable, and testable code over feature complexity.

### Backend Architecture (FastAPI + SQLAlchemy)

#### **Layered Architecture Pattern**
```
┌─────────────────┐
│   API Routes    │  ← HTTP endpoints & request/response handling
├─────────────────┤
│    Services     │  ← Business logic & orchestration
├─────────────────┤
│  Repositories   │  ← Data access abstraction layer
├─────────────────┤
│     Models      │  ← SQLAlchemy ORM entities
├─────────────────┤
│    Database     │  ← PostgreSQL with connection management
└─────────────────┘
```

#### **Key Implementation Highlights**

- **Repository Pattern**: Clean separation between business logic and data access
- **Service Layer**: Centralized business logic with proper error handling
- **Dependency Injection**: FastAPI's built-in DI for clean, testable code
- **Schema Validation**: Pydantic models for robust request/response validation
- **Configuration Management**: Environment-based config with proper validation
- **Database Management**: Async SQLAlchemy with connection pooling and transaction handling
- **Authentication**: JWT-based auth with refresh token pattern

#### **Data Access Layer**
```python
# Repository Pattern Implementation
class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_email(self, email: str) -> Optional[User]:
        # Clean, focused data access methods
        
# Service Layer Orchestration  
class UserService:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)
        # Business logic coordination
```

### Frontend Architecture (React + TypeScript)

#### **Modern React Architecture**
```
┌─────────────────┐
│   Components    │  ← Presentation layer (dumb components)
├─────────────────┤
│     Hooks       │  ← Custom hooks for reusable logic
├─────────────────┤
│     Stores      │  ← Zustand state management
├─────────────────┤
│    Services     │  ← API communication layer
├─────────────────┤
│   API Client    │  ← HTTP client with interceptors
└─────────────────┘
```

#### **Key Implementation Highlights**

- **Custom Hooks**: Reusable logic encapsulation (`useAuth`, `usePosts`)
- **State Management**: Zustand for predictable state updates
- **API Layer**: Axios-based client with automatic token refresh
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Handling**: Centralized error management across layers
- **Route Protection**: Authentication-aware routing

#### **Data Access Pattern**
```typescript
// Service Layer
class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // API communication with proper error handling
  }
}

// Store Layer (Zustand)
export const useAuthStore = create<AuthStore>((set, get) => ({
  login: async (credentials) => {
    // State management with side effects
  }
}));

// Hook Layer
export const useAuth = () => {
  // Composable logic with navigation integration
};
```

## Technical Stack

### Backend
- **FastAPI** - Modern async Python framework
- **SQLAlchemy** - Async ORM with proper query optimization
- **PostgreSQL** - Robust relational database
- **Alembic** - Database migration management
- **Pydantic** - Data validation and serialization
- **JWT** - Stateless authentication

### Frontend  
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant form handling
- **Material-UI** - Component library
- **Axios** - HTTP client with interceptors

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Configure database in .env file
alembic upgrade head
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Code Quality Features

### Backend Quality Patterns
- **Async/Await**: Proper async handling throughout
- **Error Handling**: Comprehensive exception management
- **Validation**: Pydantic schemas for all inputs/outputs
- **Security**: Password hashing, JWT tokens, CORS configuration
- **Database**: Connection pooling, transaction management, migrations

### Frontend Quality Patterns
- **Type Safety**: Full TypeScript coverage
- **Component Design**: Separation of concerns
- **State Management**: Predictable state updates
- **Error Boundaries**: Graceful error handling
- **Performance**: Optimized re-renders, lazy loading ready

## Development Patterns

This project demonstrates:

- **Repository Pattern** for data access abstraction
- **Service Layer** for business logic encapsulation  
- **Dependency Injection** for testable code
- **Custom Hooks** for reusable frontend logic
- **State Management** with proper separation
- **API Layer** abstraction with error handling
- **Type-Safe** development across the stack

## Notes

This is a **code architecture demonstration** focused on:
- Professional development patterns
- Clean code organization
- Scalable project structure
- Maintainable codebase
- Industry best practices

The project prioritizes **code quality and architecture** over feature richness, making it an excellent reference for professional full-stack development standards.