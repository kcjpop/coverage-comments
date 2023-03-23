const util = require('node:util')
const lcov = require('lcov-parse')

exports.getStats = async (path) => {
  const data = await util.promisify(lcov)(path)

  const stats = {
    lines: { found: 0, hit: 0 },
    functions: { found: 0, hit: 0 },
    branches: { found: 0, hit: 0 },
  }

  for (const obj of data) {
    for (const field of ['lines', 'functions', 'branches']) {
      if (obj[field] == null) continue

      stats[field].found += obj[field].found
      stats[field].hit += obj[field].hit
    }
  }

  Object.values(stats).forEach((obj) => {
    if (obj.found > 0)
      obj.percentage = Number(((obj.hit / obj.found) * 100).toFixed(2))
  })

  return stats
}
