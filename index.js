'use strict'

function replaceChildren(deps, parentPath, replacement = parentPath) {
  return replaceMatchingPaths(deps, new RegExp('^' + parentPath + '/.*$'), replacement)
}

function replaceMatchingPaths(deps, regex, replacement) {
  const result = {}
  // Replace all paths matching regex in keys and values
  for (const [key, values] of Object.entries(deps)) {
    const replacedValues = values.map(path => path.replace(regex, replacement))
    const replacedKey = key.replace(regex, replacement)
    result[replacedKey] = (result[replacedKey] || []).concat(replacedValues)
  }
  // Remove duplicate paths and self-dependencies from result
  for (const key in result) {
    const valueSet = new Set(result[key])
    valueSet.delete(key) // remove self-depend
    result[key] = [...valueSet]
  }
  return result
}

module.exports = {
  replaceChildren,
  replaceMatchingPaths
}