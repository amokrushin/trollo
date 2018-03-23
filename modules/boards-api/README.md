## CLI

``` bash

# install deps
yarn

# start boards-db and sshd modules
dc up -d --build boards-db sshd

# migrate up
dc run --rm boards-api npm run migrate up

# migrate up (clean)
dc run --rm boards-api npm run migrate up -- --clean

# seeds up
dc run --rm boards-api npm run seed:test up

# test
dc run --rm boards-api npm test

```
