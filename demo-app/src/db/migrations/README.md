# Migrations

## Running migrations

Each migration inside of [this folder](https://github.com/open-truss/open-truss/blob/main/demo-app/src/db/migrations) has instructions at the top.

## Creating a new migration

If you need to change the database you can create a new sql file in this directory. Generate a name for the file by first getting a timestamp prefix to use in the filename like this:

```bash
➜ date -u +"%Y-%m-%d-%H%M%S"
2024-05-10-204314
```

As an example I could create a new migration called `src/db/migrations/2024-05-10-204314-create-foo-bars.sql` and once I'm happy with the migration I could run it like this:

```bash
sqlite3 src/db/dev.db < src/db/migrations/2024-05-10-204314-create-foo-bars.sql
```

**NOTE** Make sure you create a copy of `src/db/dev.db` when you are iterating on a migration because we don't have a rollback process right now. Rolling back is as simple as replacing the borked `dev.db` with the copy you made.
