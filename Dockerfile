FROM node:8-alpine

# Install bash, Chromium (68) packages
RUN apk update && apk upgrade && \
    echo @v3.8 http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @v3.8 http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
    bash \
    udev \
    ttf-freefont \
    chromium@v3.8 \
    nss@v3.8

# Skip installing Chrome  when downloading puppeteer, use installed
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Add user so we don't need --no-sandbox.
RUN addgroup -S lunchbot && adduser -S -g lunchbot lunchbot
USER lunchbot

RUN mkdir -p /home/lunchbot/tmp \
    && mkdir -p /home/lunchbot/app

ENV APP_DIR /home/lunchbot/app
WORKDIR $APP_DIR

COPY --chown=lunchbot:lunchbot .env $APP_DIR/.env
COPY --chown=lunchbot:lunchbot package.json $APP_DIR/package.json
COPY --chown=lunchbot:lunchbot package-lock.json $APP_DIR/package-lock.json
COPY --chown=lunchbot:lunchbot app.js $APP_DIR/app.js
COPY --chown=lunchbot:lunchbot bin $APP_DIR/bin
COPY --chown=lunchbot:lunchbot src $APP_DIR/src
COPY --chown=lunchbot:lunchbot public $APP_DIR/public

RUN npm install

ENV NODE_ENV development

VOLUME $APP_DIR

EXPOSE 3000

CMD npm run dev
