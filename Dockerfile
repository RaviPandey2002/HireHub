FROM node

WORKDIR /app

# Copy package.json & lock file
COPY package.json package-lock.json* ./

# Copy prisma schema early so postinstall works
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Build your project
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
