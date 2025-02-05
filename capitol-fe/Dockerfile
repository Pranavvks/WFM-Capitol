# Use Node.js LTS version as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean install
RUN npm ci

# Copy the rest of the application code
COPY . .

# Reinstall Next.js
RUN npm install next@latest

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]