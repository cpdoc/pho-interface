# CPDOC Interface

This is the project CPDOC Interface developed with Vue 3 in Vite.

## Project Setup

Requires docker and docker compose. On the first time, just run:

```shell
make first
```

To access project with Hot-Reload, go to [localhost:5173](http://localhost:5173).

Next runs you will just need:

```shell
make start
```

### Type-Check, Compile and Minify for Production

```shell
make bundle
```

### Lint with [ESLint](https://eslint.org/)

```shell
# Enter container shell
make shell

# Then run inside the container
npm run lint
```

### Prettier with [Prettier](https://prettier.io/)

```sh
# Enter container shell
make shell

# Then run inside the container
npm run format
```
