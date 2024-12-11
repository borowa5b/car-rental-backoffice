# Stage 1 - build angular app
FROM node:lts-alpine as node-helper
WORKDIR /app
RUN npm cache clean --force
COPY . .
RUN npm install
RUN npm run build --prod

# Stage 2 - nginx
FROM nginx:1.20 as ngx
COPY --from=node-helper /app/dist/car-rentals-back-office/browser /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
