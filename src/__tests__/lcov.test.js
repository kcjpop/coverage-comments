const path = require('node:path')
const { prepareCommentParts } = require('../lcov')

it('should generate total coverage table', async () => {
  const file = path.resolve(__dirname, './lcov.info')

  const expected = `
|                   | Hit/ Total | Coverage |
|-------------------|------------|----------|
| 🌿 **Branches**   | \`5 / 6\`       | 83.33% 🤩   |
| 🔢 **Functions**  | \`12 / 14\`       | 85.71% 🤩   |
| 📝 **Lines**      | \`53 / 55\`       | 96.36% 🥳   |`

  const { totalCoverageTable } = await prepareCommentParts(file)
  expect(totalCoverageTable.trim()).toBe(expected.trim())
})
