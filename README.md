# smartlook-be-test-proj

Create migration
docker run --rm -v $(pwd)database/migrations:/migrations --network host migrate/migrate create -ext sql -dir /migrations {{ migration_name }}

Execute migration
docker run --rm -v $(pwd)/migrations:/migrations --network host migrate/migrate -verbose -path=/migrations/ -database "postgresql://hacker_news_stories:hacker_news_stories@localhost:5432/hacker_news_stories?sslmode=disable" up
