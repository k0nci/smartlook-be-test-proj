# smartlook-be-test-proj

> **IMPORTANT NOTE:** Unit and integration tests are in [TODO list](#:clipboard:-todo-list:). The API can be currently tested using postman runner

## Project structure
```
|____api-clients          -- Clients used to access 3th party APIs
|____collections-api      -- Collections API service
|____database             -- Database schema migrations
|____hn-sync              -- HackerNews sync service
|____models               -- Models used by services
|____postman              -- Postman collections and environments
|____repositories         -- Database access layer
```

## Development environment setup
Requirements:
* **Node** - v15.7.0
* **Docker** - v20.10.5
* **Postman** - v8.0.6

> :warning: Commands should be executed from root directory
```
# Setup database
docker-compose up -d postgres
docker-compose up migrate

# Install dependencies
npm i
npm run bootstrap
```

Run `collections-api` service:
```
cd collections-api
npm run start:ts
```

Run `hn-sync` service:
```
cd hn-sync
npm run start:ts
```

## Setup PostgreSQL
> :warning: Commands should be executed from root directory

**Start database**
```
docker-compose up -d postgres
```

**Execute existing migrations**
```
docker-compose up migrate
```
or:
```
docker run --rm -v $(pwd)/database/migrations:/migrations --network host migrate/migrate -verbose -path=/migrations/ -database "{{ PG_CONNECTION_STRING }}?sslmode=disable" up
```

**Create new migration**
```
docker run --rm -v $(pwd)/database/migrations:/migrations migrate/migrate create -ext sql -dir /migrations --seq {{ MIGRATION_NAME }}
```

## Build docker image
> :warning: Commands should be executed from root directory

```
SERVICE_NAME={{ SERVICE_NAME }} && docker build --build-arg BUILD_SCOPE=${SERVICE_NAME} -t ${SERVICE_NAME} .
```

## Run integration tests in Postman
Steps:
1. Setup [development environment](#development-environment-setup)
2. Setup [PostgreSQL database and execute migrations](#setup-postgresql)
4. Start `collections-api` service
5. Import `collections-api` collection and `collections-api-local` environment to Postman - find more [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
5. Set your current Postman environment to `collections-api-local`
6. Go to `collections-api` collection detail in Postman and press *Run* - find more [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
7. Press *Run collections-api* and you should view results

## :clipboard: TODO List:
* Write unit and integration tests
* Change sync of HackerNews stories to run in batches
* Improve config handling (e.g. [config](https://www.npmjs.com/package/config) package)
* Implement dependency injection (e.g. [tsyringe](https://github.com/microsoft/tsyringe) package)
