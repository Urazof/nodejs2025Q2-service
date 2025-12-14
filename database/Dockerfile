# Dockerfile для PostgreSQL базы данных
FROM postgres:16-alpine

# Метаданные
LABEL maintainer="home-library-team"
LABEL description="PostgreSQL database for Home Library application"

# Устанавливаем переменные окружения по умолчанию
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=home_library

# Копируем скрипты инициализации (если есть)
# COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Открываем порт PostgreSQL
EXPOSE 5432

# Том для данных
VOLUME ["/var/lib/postgresql/data"]

