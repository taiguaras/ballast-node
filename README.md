# Ballast Node Microservices

A Node.js microservices application for processing indications and data.

## Features

- Authentication and login APIs
- CRUD operations for indication model
- File processing API for JSON data
- PostgreSQL database integration
- Structured for testing

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later) - optional, can run in memory-only mode

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` (if not done already)
   - Update the settings to match your PostgreSQL configuration
   - Important: Update `DB_USER` and `DB_PASSWORD` to match your PostgreSQL user

3. Setup the database:
   ```
   npm run setup
   ```
   This script will:
   - Check if PostgreSQL is installed and running
   - Create the database if it doesn't exist

4. Run the application:
   ```
   npm run dev
   ```

### Running without PostgreSQL

If you don't have PostgreSQL installed or configured, you can run the application in memory-only mode:

```
npm run memory
```

In this mode:
- All data is stored in memory
- Data will be lost when the server restarts
- All API endpoints will work normally

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
```
npm test
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