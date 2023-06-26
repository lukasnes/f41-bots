const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  // CODE HERE

  test('Return an array', () => {
    expect(Array.isArray(shuffle([1,2,3]))).toBeTruthy() 
  })

  test('Not return the original', () => {
    expect(shuffle([1,2,3,4,5])).not.toEqual([1,2,3,4,5])
  })

  test('Keep the same values', () => {
    expect(shuffle([1,2,3])).toContain(3)
  })
});
