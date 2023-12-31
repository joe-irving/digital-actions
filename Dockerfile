# see https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=node:20.0.0

FROM $NODE_VERSION AS dependency-base

# create destination directory
RUN mkdir -p /app
WORKDIR /app

# copy the app, note .dockerignore
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
# RUN yarn install

FROM dependency-base AS production-base

# build will also take care of building
# if necessary
COPY . .
RUN yarn run build

FROM $NODE_VERSION AS production

COPY --from=production-base /app/.output /app/.output
COPY --from=production-base /app/package.json /app/package.json
COPY --from=production-base /app/prisma /app/prisma
COPY --from=production-base /app/node_modules /app/node_modules
COPY --from=production-base /app/bin /app/bin
COPY --from=production-base /app/google-key.json /app/google-key.json

# Service hostname
ENV NUXT_HOST=0.0.0.0

# Service version
ARG NUXT_APP_VERSION
ENV NUXT_APP_VERSION=${NUXT_APP_VERSION}

# Run in production mode
ENV NODE_ENV=production
# start the app
# CMD [ "yarn", "run", "start" ]
