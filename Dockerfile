# === STAGE 1: Build ===
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source
COPY . .

# Build Vite → output ke /app/dist
RUN npm run build



# === STAGE 2: Production ===
FROM node:22-alpine

WORKDIR /app

# Install serve untuk menyajikan file static
RUN npm install -g serve

# Copy hasil build dari stage 1
COPY --from=build /app/dist ./dist

# Expose port default 80 (serve)
EXPOSE 80

# Jalankan serve untuk folder dist
CMD ["serve", "-s", "dist", "-l", "80"]
