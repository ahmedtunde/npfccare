## Stage 1
FROM node:10.15.3 as node
LABEL author="Ahmed Tunde"
WORKDIR /webclient
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --silent
RUN npm install react-scripts@4.0.0 -g --silent
COPY . .
RUN npm run build

## Stage 2
FROM httpd:2.4.46-alpine
COPY --from=node /webclient/build /usr/local/apache2/htdocs
COPY ./config/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./config/httpd-vhosts.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf
COPY ./config/.htaccess /usr/local/apache2/htdocs/.htaccess
