/** * @author zzeee

 @description Rabbit клиент считывателя CSV.

  считывает текстовый файл из внешнего ресурса, принимает url, возвращает промис, если бы не необходимость сохранять ответ -
 * можно было бы сразу писать  в поток
 *
 * @param {string} url - url для обработки
 * @returns {Promise} Cчитанный текст в промисе
 *
 * @async
 * */

const https = require('https')
const http = require('http')
const fs = require('fs')

class CReceiver {
  constructor() {
    this.dbconn = ''
    this.rconn = ''
    console.log('!')
    MongoClient.connect(mongourl, (err, db) => {
      // Коннектимся к монго, подключение - в переменную.
      if (err) {
        console.log('Error while connecting to Mongo')
        process.exit(1)
      }
      assert.equal(null, err)
      this.dbconn = db
      console.log('Mongo connected')
    })
    amqp.connect(rabbiturl, (err, conn) => {
      // В одном цикле - коннектимся к рэббиту
      if (!err && conn) {
        this.rconn = conn
        console.log('connected to rabbit')
      }
    })
  }

  testq() {
    console.log(dbconn, rconn)
    return '2'
  }
}

const readUrl = url => {
  console.log('reading:',url)
  return new Promise((okres, rej) => {
    let srv = http
    if (url.indexOf('https') >= 0) srv = https //  Урлы могут быть и http и https, выбираем нужный протокол
    if (url.indexOf('file') >= 0) {
      try {
        const fname = url.substr('file://'.length)
        const rfile = fs.readFileSync(fname).toString()
        okres(rfile)
      } catch (ex) {
        console.log('err', ex)
        rej(new Error('error'))
      }
    }
    let localAnswer = ''
    srv
      .get(url, res => {
        const { statusCode } = res
        if (statusCode !== 200) rej(new Error('bad server answer')) // TODO Сделать разбивку 404, итп
        res.on('data', e1 => {
          localAnswer += e1
        })
        res.on('end', () => okres(localAnswer))
        res.on('error', e => {
          console.log(e)
          rej(new Error('error'))
        })
      })
      .on('error', e => {
        console.log('error', rej(e))
      })
  })
}

const parseStringToJson = (data, delim) => {
  let lines = data.split(/\r?\n/)
  let tline = [] //будущий результат
  for (let str of lines) {
    let param = str.split(delim)
    let line = []
    for (let i = 0; i < param.length; i++) {
      const qatt = param[i]
      line[i] = qatt
      /* такой перебор на будущее */
    }
    tline.push(line)
  }
  // console.log(tline);
  return tline
}

const sendRabbit = (rconn, mesq, msg) => {
  return new Promise((ok, nok) => {
    if (!rconn) nok(new Error('no connection'))
    rconn.createChannel((err2, ch2) => {
      if (!err2) {
        // console.log(msg);
        ch2.assertQueue(mesq, { durable: false })
        ch2.sendToQueue(mesq, new Buffer(msg))
        // console.log('sent'); // Опять для отладки, или место для логов в будущем
        ok()
      } else nok(err2)
    })
  })
}

module.exports.readUrl = readUrl
module.exports.sendRabbit = sendRabbit
module.exports.parseStringToJson = parseStringToJson
module.exports.CReceiver = CReceiver
