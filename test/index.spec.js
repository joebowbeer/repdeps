'use strict'

const { replaceChildren, replaceMatchingPaths, deleteChildren, deleteMatchingPaths } = require('../index')
const expect = require('chai').expect

describe('replaceChildren', function () {
  it('should return empty object when deps is empty', function () {
    expect(replaceChildren({}, 'bogus')).to.be.empty
  })
  it('should replace key matching parent', function () {
    expect(replaceChildren({ 'foo/bar': [] }, 'foo')).to.eql({ 'foo': [] })
  })
  it('should preserve key not matching parent', function () {
    expect(replaceChildren({ 'foo/bar': [] }, 'bar')).to.eql({ 'foo/bar': [] })
  })
  it('should replace value matching parent', function () {
    expect(replaceChildren({ 'baz': ['foo/bar'] }, 'foo')).to.eql({ 'baz': ['foo'] })
  })
  it('should preserve value not matching parent', function () {
    expect(replaceChildren({ 'baz': ['foo/bar'] }, 'bar')).to.eql({ 'baz': ['foo/bar'] })
  })
  it('should remove self dependency', function () {
    expect(replaceChildren({ 'foo': ['foo'] }, 'bar')).to.eql({ 'foo': [] })
  })
  it('should remove duplicate dependency', function () {
    expect(replaceChildren({ 'foo': ['bar', 'bar'] }, 'baz')).to.eql({ 'foo': ['bar'] })
  })
  it('should merge dependencies', function () {
    expect(replaceChildren({ 'foo/bar': ['a'], 'foo/baz': ['b'] }, 'foo')).to.eql({ 'foo': ['a', 'b'] })
  })
})

describe('replaceMatchingPaths', function () {
  it('should return empty object when deps is empty', function () {
    expect(replaceMatchingPaths({}, /.*/, 'bogus')).to.be.empty
  })
  it('should replace key matching a regex', function () {
    expect(replaceMatchingPaths({ 'foo/bar': [] }, /foo\/.*/, 'baz')).to.eql({ 'baz': [] })
  })
  it('should replace entries matching negative lookahead', function () {
    expect(replaceMatchingPaths({ 'w/o': ['b/c', 'c/o', 'N/A'] }, /^(?!(b|c)\/).*$/, 'x')).to.eql(
      { 'x': ['b/c', 'c/o'] })
  })
  it('should replace key using replacement group syntax', function () {
    expect(replaceMatchingPaths({ 'foo/bar': [] }, /([^/]*).*/, '$1')).to.eql({ 'foo': [] })
  })
})

describe('deleteChildren', function () {
  it('should return empty object when deps is empty', function () {
    expect(deleteChildren({}, 'bogus')).to.be.empty
  })
  it('should delete key matching parent', function () {
    expect(deleteChildren({ 'foo/bar': [] }, 'foo')).to.eql({})
  })
  it('should delete value matching parent', function () {
    expect(deleteChildren({ 'baz': ['foo/bar'] }, 'foo')).to.eql({ 'baz': [] })
  })
})

describe('deleteMatchingPaths', function () {
  it('should return empty object when deps is empty', function () {
    expect(deleteMatchingPaths({}, /.*/, 'bogus')).to.be.empty
  })
  it('should delete key matching a regex', function () {
    expect(deleteMatchingPaths({ 'foo/bar': [] }, /foo\/.*/)).to.eql({})
  })
  it('should delete value matching regex', function () {
    expect(deleteMatchingPaths({ 'baz': ['foo/bar'] }, /foo\/.*/)).to.eql({ 'baz': [] })
  })
})
