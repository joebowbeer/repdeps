const { expect } = require("chai")
const { execSync } = require("node:child_process")

const test = (input, args) => {
  return execSync(`node ./cli.js ${args}`, { input }).toString()
}

describe("CLI", () => {
  it("should parse some args", () => {
    expect(test("{}", "-p foo")).to.equal("{}")
  })
  it("should parse more args", () => {
    expect(test("{}", "-p foo -d")).to.equal("{}")
  })
})
