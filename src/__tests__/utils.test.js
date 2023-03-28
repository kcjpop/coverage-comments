const { percentage } = require('../utils')

test.each([
  [1, null, '0% 🫣'],
  [1, undefined, '0% 🫣'],
  [1, {}, '0% 🫣'],
  [1, '', '0% 🫣'],
  [1, 0, '0% 🫣'],
  [12, 100, '12% 😕'],
  [35, 100, '35% 🙂'],
  [45, 100, '45% 😀'],
  [60, 100, '60% 😃'],
  [66, 100, '66% 😊'],
  [3, 4, '75% 😊'],
  [4, 5, '80% 🤩'],
  [9, 10, '90% 🥳'],
])('calculate percentage with emoji', (a, b, expected) => {
  expect(percentage(a, b)).toBe(expected)
})
