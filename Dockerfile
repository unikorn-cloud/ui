ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY . .

RUN npm install \
 && npm run build

FROM gcr.io/distroless/nodejs${NODE_VERSION}:nonroot

COPY --from=build /app /app
WORKDIR /app

CMD ["build"]
