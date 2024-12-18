# Use official Node.js image
FROM node:18

# Set the working directory for the app inside the container
WORKDIR /app

# Copy package.json and yarn.lock first to leverage Docker's caching mechanism
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the development port
EXPOSE 3000

# Start the application in development mode
CMD ["yarn", "dev"]
