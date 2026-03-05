# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from development stage
COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
