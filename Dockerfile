ARG NODE_VERSION=20.13.1

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Install the NestJS CLI globally
RUN yarn global add @nestjs/cli

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mount to package.json and yarn.lock to avoid having to copy them into
# this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

# Create the dist directory and set appropriate permissions
RUN mkdir -p /usr/src/app/dist && chown -R node:node /usr/src/app

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Build the application
RUN yarn build

# Run the application.
CMD yarn start:prod
