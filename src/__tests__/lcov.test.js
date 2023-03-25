const path = require('node:path')
const { prepareCommentParts } = require('../lcov')

it('should generate total coverage table', async () => {
  const file = path.resolve(__dirname, './lcov.info')

  const expected = `
|                   | Hit/ Total | Coverage |
|-------------------|------------|----------|
| 🌿 **Branches**   | \`2197 / 6131\`       | 35.83%   |
| 🔢 **Functions**  | \`1172 / 2756\`       | 42.53%   |
| 📝 **Lines**      | \`3929 / 8412\`       | 46.71%   |`

  const { totalCoverageTable } = await prepareCommentParts(file)
  expect(totalCoverageTable.trim()).toBe(expected.trim())
})
