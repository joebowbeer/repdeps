#!/usr/bin/env node

'use strict'

if (require.main === module) {

  const repdeps = require('./index')
  const getStdin = require('get-stdin')

  const { parent, regex, replacement, deletion } = require('yargs')
    .usage(`Usage: $0 [-p <parent>] [-x <regex>] [-r <replacement>] [-d]\n
A JSON dependency structure is read from stdin, transformed, and written to stdout.`)
    .example('$0 -p foo', 'Replace "foo/..." paths with "foo"')
    .example('$0 -p foo -d', 'Delete "foo/..." paths')
    .example('$0 -x \'([^/]*).*\' -r \'$1\'', 'Replace all paths by their first component')
    .example('$0 -x \'^(?!foo/).*$\' -d', 'Delete all paths except "foo/..."')
    .epilog(`Either a parent (-p) or a regex (-x) is required, but not both.
Either a replacement string (-r) or deletion (-d) is required, but not both.
If only parent is specified, replacement is assumed and defaults to parent.`)
    .showHelpOnFail(false, 'Specify --help for available options')
    .strict()
    .option('parent', {
      alias: 'p',
      demand: false,
      describe: 'Parent of paths to replace',
      nargs: 1,
      type: 'string'
    })
    .option('regex', {
      alias: 'x',
      conflicts: 'parent',
      demand: false,
      describe: 'Regex matching paths to replace',
      nargs: 1,
      type: 'string'
    })
    .option('replacement', {
      alias: 'r',
      demand: false,
      nargs: 1,
      describe: 'Replacement path',
      type: 'string'
    })
    .option('deletion', {
      alias: 'd',
      conflicts: 'replacement',
      default: undefined,
      demand: false,
      describe: 'Deletion mode',
      requiresArg: false,
      type: 'boolean'
    })
    .check(function (argv) {
      if (argv.regex === undefined) {
        // Require either parent or regex
        if (argv.parent === undefined) {
          throw (new Error('One of parent (-p) or regex (-x) must be specified'))
        }
      } else {
        // Require either replacement or deletion
        if (argv.replacement === undefined && !argv.deletion) {
          throw (new Error('One of replacement (-r) or deletion (-d) must be specified'))
        }
      }
      return true
    })
    .argv

  getStdin()
    .then(str => {
      const deps = JSON.parse(str)
      return parent
        ? deletion
          ? repdeps.deleteChildren(deps, parent)
          : repdeps.replaceChildren(deps, parent, replacement)
        : deletion
          ? repdeps.deleteMatchingPaths(deps, new RegExp(regex))
          : repdeps.replaceMatchingPaths(deps, new RegExp(regex), replacement)
    })
    .then(result => process.stdout.write(JSON.stringify(result)))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
