const fs = require('node:fs')
const { xml2js } = require('xml-js')

const { percentage } = require('./utils')

function parse(filePath) {
  const xml = fs.readFileSync(filePath)
  return xml2js(xml, { compact: true })
}

function makeTotalCoverageTable(stats) {
  const total = stats.coverage.project.metrics._attributes

  const s = `\`${total.coveredstatements} / ${total.statements}\``
  const c = `\`${total.coveredconditionals} / ${total.conditionals}\``
  const m = `\`${total.coveredmethods} / ${total.methods}\``
  const e = `\`${total.coveredelements} / ${total.elements}\``

  const sp = percentage(total.coveredstatements, total.statements)
  const cp = percentage(total.coveredconditionals, total.conditionals)
  const mp = percentage(total.coveredmethods, total.methods)
  const ep = percentage(total.coveredelements, total.elements)

  return `
|                   | Hit/ Total | Coverage |
|-------------------|------------|----------|
| 🟰 **Statements** | ${s}       | ${sp}%    |
| 🌿 **Branches**   | ${c}       | ${cp}%    |
| 🔢 **Functions**  | ${m}       | ${mp}%    |
| 📝 **Elements**   | ${e}       | ${ep}%    |`
}

exports.prepareCommentParts = function prepareCommentParts(filePath) {
  const stats = parse(filePath)

  return { totalCoverageTable: makeTotalCoverageTable(stats) }
}
