# repdeps [![Build Status](https://travis-ci.org/joebowbeer/repdeps.svg?branch=master)](https://travis-ci.org/joebowbeer/repdeps)
Dependency transformer for [madge](https://github.com/pahen/madge). Replaces paths in JSON dependency structures.

## Installation

```sh
$ npm -g install repdeps
```

### Examples: Piping madge output through repdeps

This example will convert all `path/...` dependencies to `other`.

```sh
$ madge --json app.js | repdeps -p 'path' -r 'other' | madge --stdin
```

This example will convert all `path/...` dependencies to `path`. Replacement defaults to parent.

```sh
$ madge --json app.js | repdeps -p 'path' | madge --stdin
```

This example will replace all multipart paths with their first component.

```sh
$ madge --json app.js | repdeps -x '([^\/]*).*' -r '$1' | madge --stdin
```
