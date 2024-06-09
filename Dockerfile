ARG NODE_VERSION=20.13.1

# Build stage
FROM node:${NODE_VERSION}-alpine AS builder

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Install the NestJS CLI globally
RUN yarn global add @nestjs/cli

# Copy package.json and yarn.lock first to leverage Docker layer caching
COPY package.json yarn.lock ./

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN yarn install --production --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Build the application
RUN yarn build

# Final stage
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Install the NestJS CLI globally
RUN yarn global add @nestjs/cli

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD yarn start:prod
