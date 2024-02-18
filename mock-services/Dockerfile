FROM node:20-alpine3.18

RUN npm install -g json-server@0.17.4
WORKDIR /data

EXPOSE 3030
CMD ["json-server", "/data/db.json", "-H=0.0.0.0", "-p=3000"]
