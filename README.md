# fotf-ts

A project to translate the examples of my book From Objects To Functions in Typescript

I run it with bun (https://bun.sh/) because it's just too convenient.

The goal of this repo is to show:

1) webserver as a Request => Response function
2) ports and adapter architecture with an Hub interface
3) handle errors and logging with Outcome (Either monad)
4) handle db access with Context (Reader monad)

# instructions

fist make sure to get all deps:

```
bun install
```

to run the server in hot deploy mode for development:

```
bun runhot
```

then go on port 3000 and try:
```
/userName/lists        => for the lists of a user
/userName/list/1234    => to see a single list
```
