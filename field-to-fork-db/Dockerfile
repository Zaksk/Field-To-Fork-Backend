FROM postgres
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB field-db
COPY db.sql /docker-entrypoint-initdb.d/
