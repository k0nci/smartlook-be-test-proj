# smartlook-be-test-proj

> **IMPORTANT NOTE:** Setup of production build + service dockerization is in TODO list

## Project structure
```
|____api-clients          -- Clients used to access 3th party APIs
|____collections-api      -- Collections API service
|____database             -- Database schema migrations
|____hn-sync              -- HackerNews sync service 
|____models               -- Model used by services
|____repositories         -- Database access layer
```

## Development environment setup
Requirements:
* **Node** - v15.7.0
* **Docker** - v20.10.5
* **Postman** - v8.0.6

> :warning:: Commands should be executed from root package
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
> :warning:: Commands should be executed from root package

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

## TODO List:
* Write unit and integration tests
* Setup sourcemaps - use [source-map-support package](https://www.npmjs.com/package/source-map-support)
* Setup production build + write `Dockerfile`-s for collection-api and hn-sync
* Improve config handling (e.g. [config package](https://www.npmjs.com/package/config))
* Implement dependency injection (e.g. [tsyringe package](https://github.com/microsoft/tsyringe))

