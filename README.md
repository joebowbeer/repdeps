# repdeps [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=joebowbeer_repdeps&metric=coverage)](https://sonarcloud.io/summary/new_code?id=joebowbeer_repdeps)

Dependency transformer for [madge](https://github.com/pahen/madge). Replaces paths in JSON dependency structures.

## Installation

```sh
$ npm -g install repdeps
```

### Examples: Piping madge output through repdeps

Convert all `path/...` dependencies to `other`.

```sh
$ madge --json app.js | repdeps -p 'path' -r 'other' | madge --stdin
```

Convert all `path/...` dependencies to `path`. (Replacement defaults to parent.)

```sh
$ madge --json app.js | repdeps -p 'path' | madge --stdin
```

Replace all multipart paths with their first component.

```sh
$ madge --json app.js | repdeps -x '([^\/]*).*' -r '$1' | madge --stdin
```
