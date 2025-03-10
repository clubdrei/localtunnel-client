FROM node:lts as tunnel
ARG LOCALTUNNEL_HOST
ARG LOCALTUNNEL_SECURE
ARG LOCALTUNNEL_LOCAL_HOST
ARG LOCALTUNNEL_PORT
ARG LOCALHOST_SUBDOMAIN
ARG LOCALTUNNEL_HEALTHCHECK_PATH
ENV LOCALTUNNEL_HOST=${LOCALTUNNEL_HOST}
ENV LOCALTUNNEL_SECURE=${LOCALTUNNEL_SECURE}
ENV LOCALTUNNEL_LOCAL_HOST=${LOCALTUNNEL_LOCAL_HOST}
ENV LOCALTUNNEL_PORT=${LOCALTUNNEL_PORT}
ENV LOCALHOST_SUBDOMAIN=${LOCALHOST_SUBDOMAIN}
ENV LOCALTUNNEL_HEALTHCHECK_PATH=${LOCALTUNNEL_HEALTHCHECK_PATH}
COPY /lib /app/lib
COPY /index.js /app/
COPY /healthcheck.js /app/healthcheck.js
RUN cd /app && npm install localtunnel
WORKDIR /app
HEALTHCHECK --interval=60s --timeout=10s --start-period=15s --retries=1 CMD node /app/healthcheck.js
CMD ["node", "index.js"]

