FROM node:14

# Add package file
COPY package*.json ./

# Install deps
RUN npm install

# Copy source
COPY . ./



# Expose port 3000
EXPOSE 80

CMD npm run start