FROM node:20.17.0 as builder
ARG APP
ENV APP=$APP
WORKDIR /app
COPY . .
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    npm i -g pnpm@9.7.1 && \
    pnpm i --frozen-lockfile && \
    pnpm run build && \
#    pnpm rebuild @tensorflow/tfjs-node --build-addon-from-source && \
    pnpm run cleanup:node_modules && \
    pnpm i --production --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "start"]
