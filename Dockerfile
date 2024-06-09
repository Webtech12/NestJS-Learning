# ARG for Node.js version
ARG NODE_VERSION=20.13.1

# Build stage
FROM node:${NODE_VERSION}-alpine AS builder

# Set environment to production
ENV NODE_ENV production

# Set working directory
WORKDIR /usr/src/app

# Install the NestJS CLI globally
RUN yarn global add @nestjs/cli

# Install dependencies
# Copy package.json and yarn.lock first to leverage Docker layer caching
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy application source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:${NODE_VERSION}-alpine

# Set environment to production
ENV NODE_ENV production

# Set working directory
WORKDIR /usr/src/app

# Copy necessary files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Ensure production dependencies are installed
RUN yarn install --production --frozen-lockfile

# Set node user for security
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
