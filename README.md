# Texas Poker Game

This is an online Texas Hold'em game, base on TypeScript,Egg,Node.js,Vue

## Docker start

```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml build api --no-cache
```

Build specify service:

```bash
docker-compose -f docker-compose.prod.yml build --no-cache api
docker-compose -f docker-compose.prod.yml build --no-cache nginx
```

## Server

base on midway.js,TypeScript, socket.io, mysql.

Detail: [server-readme](./server/README.md)

## Client

base on vue-cli, TypeScript, socket.io.

Detail: [client-readme](./client/README.md)

## Project structure

``` plain
├─client
├─database
│  └─poker.sql
└─server
```

## Demo

![demo1](./images/demo1.gif)

![demo2](./images/demo2.gif)

![demo3](./images/demo3.gif)

![demo4](./images/demo4.gif)

## License

The MIT License (MIT)
