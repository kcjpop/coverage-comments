const util = require('node:util')
const lcov = require('lcov-parse')
const parse = util.promisify(lcov)

const { percentage } = require('./utils')

function calculateStats(coverage) {
  const stats = {
    lines: { found: 0, hit: 0 },
    functions: { found: 0, hit: 0 },
    branches: { found: 0, hit: 0 },
  }

  for (const obj of coverage) {
    for (const field of ['lines', 'functions', 'branches']) {
      if (obj[field] == null) continue

      stats[field].found += obj[field].found
      stats[field].hit += obj[field].hit
    }
  }

  Object.values(stats).forEach((obj) => {
    obj.percentage = percentage(obj.hit / obj.found)
  })

  return stats
}

function makeTotalCoverageTable(stats) {
  const b = `\`${stats.branches.hit} / ${stats.branches.found}\``
  const f = `\`${stats.functions.hit} / ${stats.functions.found}\``
  const l = `\`${stats.lines.hit} / ${stats.lines.found}\``

  const bp = percentage(stats.branches.hit, stats.branches.found)
  const fp = percentage(stats.functions.hit, stats.functions.found)
  const lp = percentage(stats.lines.hit, stats.lines.found)

  return `
|                   | Hit/ Total | Coverage |
|-------------------|------------|----------|
| 🌿 **Branches**   | ${b}       | ${bp}   |
| 🔢 **Functions**  | ${f}       | ${fp}   |
| 📝 **Lines**      | ${l}       | ${lp}   |`
}

exports.prepareCommentParts = async function prepareCommentParts(filePath) {
  const coverage = await parse(filePath)
  const stats = calculateStats(coverage)

  return { totalCoverageTable: makeTotalCoverageTable(stats) }
}
