const path = require('node:path')
const { prepareCommentParts } = require('../clover')

it('should generate total coverage table', async () => {
  const file = path.resolve(__dirname, './clover.xml')

  const expected = `
|                   | Hit/ Total | Coverage |
|-------------------|------------|----------|
| 🟰 **Statements** | \`4272 / 8903\`       | 47.98% 😃    |
| 🌿 **Branches**   | \`2437 / 6587\`       | 37% 😙    |
| 🔢 **Functions**  | \`1287 / 2904\`       | 44.32% 😃    |
| 📝 **Elements**   | \`7996 / 18394\`       | 43.47% 😃    |`

  const { totalCoverageTable } = await prepareCommentParts(file)
  expect(totalCoverageTable.trim()).toBe(expected.trim())
})
