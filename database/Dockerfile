FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE tom_e_commerce

ADD setup.sql /docker-entrypoint-initdb.d
