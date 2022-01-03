FROM justadudewhohacks/opencv-nodejs:node9-opencv3.4.1-contrib

WORKDIR /app
COPY . .
ENV NODE_PATH=/usr/lib/node_modules/

EXPOSE 8888

CMD [ "node", "server.js" ]
