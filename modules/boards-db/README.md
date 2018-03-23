# boards-db

boards-db extends [official postgres image](https://hub.docker.com/_/postgres/)

[How to extend postgres image](https://docs.docker.com/samples/library/postgres/#how-to-extend-this-image)

> After the entrypoint calls initdb to create the default postgres user and database,
> it will run any *.sql files and source any *.sh scripts found in /docker-entrypoint-initdb.d
> directory to do further initialization before starting the service.
