FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package.json & lock file
COPY package.json package-lock.json* ./

# Copy prisma schema early so postinstall works
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Explicitly generate Prisma Client
RUN npx prisma generate

# Copy the rest of your project
COPY . .

# Build-time environment placeholders to allow static Next.js compilation
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="mongodb://localhost:27017/hirehub"
ENV AUTH_SECRET="build-secret-placeholder"
ENV NEXTAUTH_SECRET="build-secret-placeholder"

# Build your project
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
