'use strict'

function replaceChildren(deps, parentPath, replacement = parentPath) {
  return replacePaths(deps, s => s.startsWith(parentPath + '/') ? replacement : s)
}

function replaceMatchingPaths(deps, regex, replacement) {
  return replacePaths(deps, s => s.replace(regex, replacement))
}

function replacePaths(deps, replacer) {
  const result = {}
  // Replace all paths matching regex in keys and values
  for (const [key, values] of Object.entries(deps)) {
    const replacedValues = values.map(replacer)
    const replacedKey = replacer(key)
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
