FROM nginx:1.13.6-alpine

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx.conf      /etc/nginx/nginx.conf
ADD proxy.conf      /etc/nginx/proxy.conf
ADD default.conf    /etc/nginx/conf.d/default.conf

COPY ./static /var/www/static

EXPOSE 80
