const { add } = require('./func')

test('add', () => {
  expect(add(2, 4)).toBe(6)
})
