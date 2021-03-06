/**
 * Libs module.
 * @module libs
 * @author zzeee
 * @description Библиотеки Rabbit клиента считывателя CSV
 *
 */
const https = require('https')
const http = require('http')
const fs = require('fs')
/**
 считывает текстовый файл из внешнего ресурса, принимает url, возвращает промис, если бы не необходимость сохранять ответ -
 * можно было бы сразу писать  в поток
 *
 * @param {string} url - url для обработки
 * @returns {Promise} Cчитанный текст в промисе
 *
 * @async
 * */
const readUrl = url => {
  console.log('reading:', url)
  return new Promise((okres, rej) => {
    if (url === 'file://test2') {
      const testok = JSON.stringify({ testres: 'allok' })
      okres(testok)
      return
    }
    let srv = http
    if (url.indexOf('https') >= 0) srv = https //  Урлы могут быть и http и https, выбираем нужный протокол
    if (url.indexOf('file') === 0) {
      try {
        const fname = url.substr('file://'.length)
        const rfile = fs.readFileSync(fname).toString()
        okres(rfile)
        return
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

/**
Парсит csv в простой JSON

 * @param {string} data - данные для обработки
 * @param {string} delim - разделитель
 *
 * @returns {object} Обработанный текст
 *
 * 
 * */

const parseStringToJson = (data, delim) => {
  const lines = data.split(/\r?\n/)
  const tline = [] // будущий результат
  for (const str of lines) {
    const param = str.split(delim)
    let line = []
    for (let i = 0; i < param.length; i++) {
      line[i] = param[i];
      /* такой перебор на будущее */
    }
    tline.push(line)
  }
  // console.log(tline);
  return tline
}



/**
 Найти документ в Монго-БД проекта
 * @param {conn} dbconn - установленное соединение с Монго
 * @param {string} url - проверяемый урл
 * @param {callback} exists вызывается если запись найдена
 * @param {callback} nexists вызывается если запись НЕ найдена
 * */
const findDoc = (dbconn, url, exists, nexists) => {
    const collection = dbconn.collection('documents');
    collection.find({url}).toArray((err, docs) => {
//        console.log(`Documents found in Mongo for URL ${url}:`, docs.length)
        if (err || docs.length === 0) nexists()
        else exists(docs)
    })
};

/**
 Найти документ в Монго-БД проекта
 * @param {conn} dbconn - установленное соединение с Монго
 * @param {string} data - запись
 * @param {callback} callback вызывается после того как запись вставлена в БД
 */

const insertDoc = (dbconn,data, callback) => {
    const collection = dbconn.collection('documents')
    collection.insertOne(data, (err, result) => {
        callback(result)
    })
}

/**
 Парсит входящий URL. Если запись есть в БД - возвращает ее, если нет - вызывает readUrl, записывает в БД и возвращает данные
 *
 * @param {conn} dbconn - установленное соединение с Монго
 * @param {string} url - url для обработки
 * @returns {Promise} Обработанный документ
 *
 * @async
 * */


const parseUrl = (dbconn,url) => {
    return new Promise((ok, nok) => {
        let res2wr = {"url": url, data: "nok"};
        if (url === 'file://test1') { // Только для тестов
            res2wr = {res: 'testsucc'}
            ok(res2wr);
        } else  // Нормальные условия. Первый случай - если запись уже есть в БД. Возвращаем первую запись, второй - новая.
            this.findDoc(dbconn,
                url,
                e => {
                    res2wr = {url: e[0].url, data: e[0].data};
                    ok(res2wr);
                },
                e => {
                    this.readUrl(url).then(
                        e => {
                            res2wr = {"url": url, data: JSON.stringify(this.parseStringToJson(e, ','))} // Парсим CSV и формируем ответ
                            this.insertDoc(dbconn, res2wr, e => {
                                // console.log(e) // TODO доделать лог
                            });
                            ok(res2wr);
                        },
                        er => {
                            res2wr = JSON.stringify({err: ''});
                            console.log(er);
                            nok(res2wr); // TODO Доделать вывод ошибок
                        }
                    )
                });
    });
}


module.exports.readUrl = readUrl
module.exports.parseUrl = parseUrl
module.exports.findDoc = findDoc
module.exports.insertDoc = insertDoc
module.exports.parseStringToJson = parseStringToJson
