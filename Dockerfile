# Step 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build-time variable
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Generate the .env file dynamically
RUN echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" > .env

RUN npm run build

# Step 2: Serve with a lightweight server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 6666
CMD ["nginx", "-g", "daemon off;"]
