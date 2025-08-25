# Use an official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and lockfile first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (with hoisting for supabase bin warnings)
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Copy the rest of the app
COPY . .

# Add environment variables directly
ENV NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc3VhZGNpanlzYnNkeXFpeGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MDEyMzQsImV4cCI6MjA3MTQ3NzIzNH0.Ku6qbRoJKbD5UnSAXj9MzAgOvngrBQH03SVO6BS8_IY"
ENV NEXT_PUBLIC_SUPABASE_URL="postgresql://postgres:Onthewall19.@db.pjsuadcijysbsdyqixfe.supabase.co:5432/postgres"
ENV SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc3VhZGNpanlzYnNkeXFpeGZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTkwMTIzNCwiZXhwIjoyMDcxNDc3MjM0fQ.YMa6B_Ym9GRRDU6mPT0di0DBkJirKzzh7DxZ1zZHv7o"
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
ENV STRIPE_SECRET_KEY=""
ENV STRIPE_WEBHOOK_SECRET=""

# Build the project
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
