/**
 * Get emoji reaction based on coverage percentage
 *
 * @param {number} pct Coverage percentage
 * @returns {string}
 */
const emoji = (pct) => {
  const map = [
    [-1, 10, '🫣'],
    [10, 30, '😕'],
    [30, 40, '😙'],
    [40, 50, '😃'],
    [50, 80, '😊'],
    [80, 90, '🤩'],
    [90, 101, '🥳'],
  ]

  const [, , e] = map.find(([min, max]) => pct >= min && pct < max)
  return e
}

const percentage = (a, b) => {
  const pct = b > 0 ? Number(((a / b) * 100).toFixed(2)) : 0

  return pct + '% ' + emoji(pct)
}

module.exports = { percentage }
