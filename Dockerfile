# Use an official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the project
RUN pnpm run build

# Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# Start the app (adjust if your script is different)
CMD ["pnpm", "start"]
