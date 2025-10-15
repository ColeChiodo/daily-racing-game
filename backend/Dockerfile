FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript and type definitions (dev dependencies)
RUN npm install --save-dev typescript ts-node @types/node @types/express @types/cors ts-node-dev

# Copy tsconfig and source files, including migrations
COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations

# Start the app
CMD ["npm", "start"]
