# Build Stage
FROM node:18-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# Skip type check based on previous tsconfig relaxation, but run build
RUN npm run build

# Serve Stage
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
