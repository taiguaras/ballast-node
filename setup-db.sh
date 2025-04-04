#!/bin/bash

# Load environment variables
source .env

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first."
    echo "On macOS, you can use: brew install postgresql@15"
    echo "On Ubuntu: sudo apt-get install postgresql"
    exit 1
fi

# Check if PostgreSQL is running
pg_isready > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "PostgreSQL is not running. Please start it first."
    echo "On macOS: brew services start postgresql@15"
    echo "On Ubuntu: sudo service postgresql start"
    exit 1
fi

# Create database if it doesn't exist
echo "Creating database $DB_NAME if it doesn't exist..."
createdb $DB_NAME 2>/dev/null || echo "Database $DB_NAME already exists."

echo "Database setup complete!"
echo "You can now run the application with: npm run dev" 