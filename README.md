# First run
docker compose -f docker-compose.dev.yml up --build

# every next run
docker compose -f docker-compose.dev.yml  up

# launch in background mode
docker compose  -f docker-compose.dev.yml  up -d

# stop the container
docker compose  -f docker-compose.dev.yml  down