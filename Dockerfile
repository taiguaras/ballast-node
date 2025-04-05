FROM node:18-alpine

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy package.json and package-lock.json first for better layer caching
COPY package*.json ./

RUN npm install

# Copy the wait-for-postgres script
COPY wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# Copy the rest of the application code
COPY . .

EXPOSE 3000

CMD ["npm", "start"] 