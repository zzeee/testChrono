const libs = require('../nodeserver/libs.js')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const serverUrl = 'http://127.0.0.1:8080'
chai.use(chaiAsPromised)

// Then either:
const expect = chai.expect
// or:
const assert = chai.assert
// or:
chai.should()

describe('check integration. PHP ONLY', () => {
    it('checking connection to rabbit without external access', () => {
        const sansw = '{"res":"phptestok"}'
        return libs.readUrl(serverUrl + '/?testq=1').should.eventually.equal(sansw)
    })
})


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

/*
describe('check integration. testing php->rabbit->node without mongo', () => {
  it('checking connection to rabbit without external access', () => {
    const cerr='{"url":"file:\\\/\\/testtest","data":"{\\"err\\":{}}"}';
    return libs.readUrl("http://localhost:8080/?param=file://testtest").should.eventually.equal(cerr);
  })
})
*/

describe('check integration. testing php->rabbit->node without mongo', () => {
  it('checking connection to rabbit without external access', () => {
    const sansw = '{"url":"file:\\/\\/test1","data":"{\\"res\\":\\"testsucc\\"}"}'
    return libs.readUrl(serverUrl + '/?param=file://test1').should.eventually.equal(sansw)
  })
})
describe('check integration. testing php->rabbit->node without mongo.read from file ', () => {
  it('checking connection to rabbit without external access', () => {
    const cmpr2 =
      '{"url":"file:\\/\\/example2.csv","data":"{\\"url\\":\\"file:\\/\\/example2.csv\\",\\"data\\":\\"[[\\\\\\"1\\\\\\",\\\\\\"2\\\\\\",\\\\\\"3\\\\\\"]]\\"}"}'

    return libs.readUrl(serverUrl + '/?param=file://example2.csv').should.eventually.equal(cmpr2)
  })
})

