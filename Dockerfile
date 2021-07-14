FROM node:14-alpine

# Copy source
COPY . ./
# # Add package file
# COPY package*.json ./

# Install deps
RUN npm install




# Expose port 3000
EXPOSE 80

CMD npm run start