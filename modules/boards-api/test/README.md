## CLI

1. Migrate up database

``` bash
dc run --rm boards-api npm run migrate --  up --clean
```

2. Seed up test dataset

``` bash
dc run --rm boards-api npm run seed:test up
```

3. Run unit tests

```bash
dc run --rm boards-api npm test test/unit/*
```

4. Run integration tests

```bash
dc run --rm boards-api npm test test/integration/*
```
