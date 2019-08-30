#Use node 10.16.3-jessie-slim
FROM mhart/alpine-node:11
COPY . /lunchbot
WORKDIR /lunchbot
RUN [ "npm", "i" ]
EXPOSE 4000
CMD [ "npm", "start" ]