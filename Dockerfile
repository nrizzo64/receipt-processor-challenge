# Use an official Node.js runtime as a parent image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the app files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Set the command to run the app
CMD ["node", "./src/server.js"]

