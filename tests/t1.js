const libs = require('../libs.js')
const assert = require('assert')

describe('checkjson', () => {
  it('checking csv to json', () => {
    //   const obj2=[[23,45],[1,2]];
    assert.equal(JSON.stringify(libs.parseStringToJson('23,45\n1,2', ',')), JSON.stringify([['23', '45'], ['1', '2']]))
  })
})

describe('checkjson', () => {
  it('checking connection to rabbit without external access', () => {
    //   const obj2=[[23,45],[1,2]];

    assert.equal(JSON.stringify(libs.parseStringToJson('23,45\n1,2', ',')), JSON.stringify([['23', '45'], ['1', '2']]))
  })
})
