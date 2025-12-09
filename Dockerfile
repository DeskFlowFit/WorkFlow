FROM node:18-alpine

WORKDIR /app

# Copy ALL files FIRST (including index.html, vite.config.js, src/, etc.)
COPY . .

# THEN install dependencies
RUN npm install

# THEN build with Vite
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
