# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM inmindcz/node:18 as builder

ARG TARGETOS TARGETARCH
ARG YARN_COMMAND=production

LABEL maintainer="ondrej.kopal@in-mind.cz"

WORKDIR /opt/app

RUN apk add --no-cache dumb-init

COPY package.json /opt/app/package.json

RUN npm install --legacy-peer-deps

COPY . /opt/app

FROM inmindcz/node:18

ENV NODE_ENV production

COPY --chown=node:node --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --chown=node:node --from=builder /opt/app /opt/app

WORKDIR /opt/app

USER node

CMD ["dumb-init", "node", "--max_old_space_size=4096", "./server.js"]
