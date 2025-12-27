# Big Brother API

Big Brother is watching you

## Prerequisites

-   [Docker](https://www.docker.com/get-started/)
-   [Node.js and npm](https://nodejs.org/en/download)

## Local development setup:

### Suggested hybrid setup - storage in docker, node app locally

1. Run storage docker containers (database and redis):

```bash
# if your system has Make
make copy-env
make db

# otherwise
cp .env.template .env
docker compose up -d postgres redis
```

2. Run node app locally

```bash
# at first launch or when package.json is changed
npm install

# terminal 1
npm run build:watch

# terminal 2 (start when initial build iteration done)
npm run start:watch
```

### Alternative - all in docker

1. Run all docker containers:

```bash
# if your system has Make
make init

# otherwise
cp .env.template .env
docker compose up -d --build
```

## Production build

```bash
# builds the app in production mode
# output distribution to be found in 'build' folder
npm run build

# starts the app
npm run start
```

## Misc

### If you're using VSCode

It's recommended to install the following extensions:

-   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), id: `esbenp.prettier-vscode`
-   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), id: `dbaeumer.vscode-eslint`
