FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# Expose host to allow access from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
