const path = require('node:path')
const { prepareCommentParts } = require('../clover')

it('should generate total coverage table', async () => {
  const file = path.resolve(__dirname, './clover.xml')

  const expected = `
|                   | Hit/ Total | Coverage |
|-------------------|------------|----------|
| 🟰 **Statements** | \`53 / 55\`       | 96.36% 🥳    |
| 🌿 **Branches**   | \`5 / 6\`       | 83.33% 🤩    |
| 🔢 **Functions**  | \`12 / 14\`       | 85.71% 🤩    |
| 📝 **Elements**   | \`70 / 75\`       | 93.33% 🥳    |`

  const { totalCoverageTable } = await prepareCommentParts(file)
  expect(totalCoverageTable.trim()).toBe(expected.trim())
})
