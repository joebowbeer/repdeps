#!/usr/bin/env node

'use strict'

if (require.main === module) {

  const { replaceChildren, replaceMatchingPaths } = require('./index')
  const getStdin = require('get-stdin')

  const { parent, regex, replacement } = require('yargs')
    .usage(`Usage: $0 [-p <parent>] [-x <regex>] [-r <replacement>]\n
A JSON dependency structure is read from stdin, transformed, and written to stdout.`)
    .example('$0 -p foo', 'Replace "foo/..." paths with "foo"')
    .example('$0 -x "([^\/]*).*" -r "\\$1"', 'Replace all paths by their first component')
    .epilog(`Either parent (-p) or regex (-x) is required, but not both.
If parent is specified then replacement (-r) is optional and defaults to parent.`)
    .showHelpOnFail(false, 'Specify --help for available options')
    .strict()
    .option('p', {
      alias: 'parent',
      conflicts: 'x',
      demand: false,
      describe: 'Parent of paths to replace',
      nargs: 1,
      type: 'string'
    })
    .option('x', {
      alias: 'regex',
      conflicts: 'p',
      demand: false,
      describe: 'Regex matching paths to replace',
      implies: 'r',
      nargs: 1,
      type: 'string'
    })
    .option('r', {
      alias: 'replacement',
      demand: false,
      nargs: 1,
      describe: 'Replacement path',
      type: 'string'
    })
    .check(function (argv) {
      // Require either parent or regex
      if (argv.p === undefined && argv.x === undefined) {
        throw (new Error('One of parent (-p) or regex (-x) must be specified'))
      }
      return true
    })
    .argv

  getStdin()
    .then(str => {
      const deps = JSON.parse(str)
      return parent
        ? replaceChildren(deps, parent, replacement)
        : replaceMatchingPaths(deps, new RegExp(regex), replacement)
    })
    .then(result => process.stdout.write(JSON.stringify(result)))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
