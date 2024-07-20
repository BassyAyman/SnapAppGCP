# Launches locally the postgres database for read and write message servers

docker run --name my_postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mydb -p 5432:5432 -e POSTGRES_HOST=localhost -d postgres:13