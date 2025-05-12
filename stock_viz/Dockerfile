FROM node:alpine3.20

# Add labels for better maintainability
LABEL maintainer="ngonguyenducthang"
LABEL description="Stock Visualization Application"

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
