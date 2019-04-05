FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE CHIRINOS
ENV MYSQL_USER root
ENV MYSQL_PASSWORD root

ADD setup.sql /docker-entrypoint-initdb.d
