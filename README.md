# fotf-ts

A project to translate the examples of my book From Objects To Functions in Typescript

I run it with bun (https://bun.sh/) because it's just too convenient.

The goal of this repo is to show:

1) webserver as a Request => Response function
2) ports and adapter architecture with an Hub interface
3) handle errors and logging with Outcome (Either monad)
4) handle db access with Context (Reader monad)

# instructions
```
bun install
```

then

```
bun runhot
```

then go on port 3000 and try:
```
/pippo/lists
/pippo/list/1234
```
