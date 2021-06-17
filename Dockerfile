FROM node:14.15.0-stretch AS builder
# Default value; will be overridden by build_args, if passed
ARG NODE_ENV=development
ARG NPM_TOKEN=

ENV NODE_ENV $NODE_ENV
ENV NPM_TOKEN $NPM_TOKEN

WORKDIR /app
ADD docker/.npmrc .npmrc

ADD package.json .
ADD package-lock.json .
RUN npm install

ADD .babelrc .
ADD .eslintrc .

ADD src src/

ENTRYPOINT [ "npm", "run", "dev" ]


FROM builder AS test

ENV NODE_ENV test

RUN npm run lint

ENTRYPOINT [ "npm", "run", "test" ]


FROM builder AS production

ENV NODE_ENV production

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]
