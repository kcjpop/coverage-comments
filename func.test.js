const { mul, add } = require('./func')

test('add', () => {
  expect(add(2, 4)).toBe(6)
})

test('mul', () => {
  expect(mul(2, 4)).toBe(8)
})
