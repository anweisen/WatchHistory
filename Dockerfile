FROM node:latest AS build

WORKDIR /app

COPY package.json ./
COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

# setup nginx config
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
