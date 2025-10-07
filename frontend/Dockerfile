FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY index.html ./
COPY .env ./
COPY src ./src
RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
