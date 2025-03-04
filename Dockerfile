# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (adjust based on your app's port)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
