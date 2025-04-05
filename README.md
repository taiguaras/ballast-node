# Ballast Node Microservices

A Node.js microservices application for processing indications and data.

## Features

- Authentication and login APIs
- CRUD operations for indication model
- File processing API for JSON data
- PostgreSQL database integration
- Structured for testing

## Docker Setup

This project is containerized with Docker for easy setup and consistent environments. Follow the instructions below to get started.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Getting Started with Docker

#### Standard Environment

1. Build and start the containers:
   ```bash
   npm run docker:up
   ```
   
   Or in detached mode:
   ```bash
   npm run docker:up:detached
   ```

2. Stop and remove the containers:
   ```bash
   npm run docker:down
   ```

#### Development Environment

The development environment includes additional services like pgAdmin.

1. Build and start the development containers:
   ```bash
   npm run docker:dev
   ```
   
   Or in detached mode:
   ```bash
   npm run docker:dev:detached
   ```

2. Stop and remove the development containers:
   ```bash
   npm run docker:dev:down
   ```

### Database Operations

Run migrations:
```bash
npm run docker:db:migrate
```

Seed the database:
```bash
npm run docker:db:seed
```

### Accessing Services

- **Node.js API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **pgAdmin** (Development only): http://localhost:5050
  - Email: admin@admin.com
  - Password: admin

## Local Development (Without Docker)

If you prefer to run the application without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ballast
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret_for_development
   ```

3. Run the setup script to initialize the database:
   ```bash
   npm run setup
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Or to use in-memory storage (no database required):
   ```bash
   npm run memory
   ```

## Common Issues

If you encounter database connection issues:

1. Make sure PostgreSQL is running
   - macOS: `brew services start postgresql`
   - Linux: `sudo service postgresql start`

2. Create database manually if the setup script fails:
   ```
   createdb ballast_db
   ```

3. Check if your PostgreSQL user exists and has proper privileges

4. Try running in memory-only mode:
   ```
   npm run memory
   ```

## API Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get JWT token
- `GET/POST/PUT/DELETE /api/indications` - CRUD for indications
- `POST /api/file/process` - Process JSON files with indications

## Testing

Run tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Project Structure

```
src/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── middleware/    # Express middlewares
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── tests/         # Test files
└── utils/         # Utility functions
``` 