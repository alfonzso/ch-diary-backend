FROM nginx:stable-alpine
ARG GIT_VERSION
ENV REACT_APP_GIT_VERSION ${GIT_VERSION:-".-undef-."}

# ADD  src/views/_resources /usr/share/nginx/html/_resources
# COPY src/views/layouts/index.hbs /usr/share/nginx/html/index.html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
ADD . /usr/share/nginx/html/

EXPOSE 80