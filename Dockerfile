FROM gliderlabs/alpine:3.1
RUN apk --update add bash nodejs git
WORKDIR /app/jarvis-groupme
ADD . .
RUN npm install --no-optional
CMD npm start