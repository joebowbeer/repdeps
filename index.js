'use strict'

const DELETED = '' // Marker for deleted entries

function replaceChildren(deps, parentPath, replacement = parentPath) {
  return replacePaths(deps, s => s.startsWith(parentPath + '/') ? replacement : s)
}

function replaceMatchingPaths(deps, regex, replacement) {
  return replacePaths(deps, s => s.replace(regex, replacement))
}

function deleteChildren(deps, parentPath) {
  return replaceChildren(deps, parentPath, DELETED)
}

function deleteMatchingPaths(deps, regex) {
  return replaceMatchingPaths(deps, regex, DELETED)
}

function replacePaths(deps, replacer) {
  const result = {}
  // Replace all paths matching regex in keys and values
  for (const [key, values] of Object.entries(deps)) {
    const replacedValues = values.map(replacer)
    const replacedKey = replacer(key)
    if (replacedKey !== DELETED) {
      result[replacedKey] = (result[replacedKey] || []).concat(replacedValues)
    }
  }
  // Remove duplicate and deleted paths, and self-dependencies from result
  for (const key in result) {
    const valueSet = new Set(result[key])
    valueSet.delete(key) // self-depend
    valueSet.delete(DELETED)
    result[key] = [...valueSet]
  }
  return result
}

module.exports = {
  deleteChildren,
  deleteMatchingPaths,
  replaceChildren,
  replaceMatchingPaths
}
