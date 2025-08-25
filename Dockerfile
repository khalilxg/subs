FROM node:20-alpine

WORKDIR /app

# Ensure .bin exists
RUN mkdir -p /app/node_modules/.bin

# Install pnpm globally
RUN npm install -g pnpm

# Copy lockfile and package.json first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (with hoist for supabase)
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Copy the rest of the project
COPY . .

# Copy environment variables (if you have .env)
COPY .env .env

# Build the project
RUN pnpm run build

# Expose app port
EXPOSE 3000

# Run app
CMD ["pnpm", "start"]
