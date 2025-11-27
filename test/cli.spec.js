const { expect } = require("chai")
const { execSync } = require("node:child_process")

const test = (input, args) => {
  return execSync(`node ./cli.js ${args}`, { input }).toString()
}

describe("CLI", () => {
  it("should run", () => {
    expect(test("{}", "-p foo")).to.equal("{}\n")
  })
})
