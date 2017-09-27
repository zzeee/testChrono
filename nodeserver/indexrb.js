/** * @author zzeee

 @description Rabbit клиент считывателя CSV.
 */

const amqp = require('amqplib/callback_api')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const libs = require('./libs.js')
/** @constant {string} */
const rabbiturl = 'amqp://localhost'
/** @constant {string}  */
const mongourl = 'mongodb://localhost:27017/'
/** @constant {string} */
const sendq = 'hello'
/** @constant {string} */

const receiveq = 'hello2'
let dbconn = ''
let rconn = ''
MongoClient.connect(mongourl, (err, db) => {
  // Коннектимся к монго, подключение - в переменную.
  if (err) {
    console.log('Error while connecting to Mongo')
    process.exit(1)
  }
  dbconn = db
  console.log('Mongo connected')
})
/** Парсинг csv документа, приходящего в виде строки в JSON.  Разделитель -  в параметре delim.  Кавычки не раскрывает
 * возвращает объект. Строки ответа могут быть разной длины.
 *
 * @param {string} data - данные для обработки
 * @param {string} delim - разделитель, например ','
 * @returns {object}

 * */
/** Найти запись в монго по URL
 * @param callback
 */
const findDoc = (url, exists, nexists) => {
  // Get the documents collection
  const collection = dbconn.collection('documents')
  collection.find({ url: url }).toArray((err, docs) => {
    console.log(`Documents found in Mongo for URL ${url}:`, docs.length)
    if (err || docs.length === 0) nexists()
    else exists(docs)
  })
}
/** добавить запись об csv-url в БД.
 * @param {object} data - данные для вставки в базу
 * */

const insertDoc = (data, callback) => {
  const collection = dbconn.collection('documents')
  // Insert some documents
  collection.insertOne(data, (err, result) => {
    callback(result)
  })
}
/**
 *Отправляет сообщение в рэббит по уже установленному соединению
 *
 *
 * @param (string) q - код очереди
 * @param (string) msg - сообщение
 * @returns (Promise)
 *
 *
 */

const readFromUrlSendRes = url => {
  let qres = libs.readUrl(url).then(
    // Запрашиваем
    e => {
      console.log(url, '..read') // Для отладки,- выводим запрашиваемый url
      let res2wr = { url: url, data: JSON.stringify(libs.parseStringToJson(e, ',')) } // Парсим CSV и формируем ответ
      insertDoc(res2wr, e => {
        //console.log(e);
      })
      libs.sendRabbit(rconn, receiveq, JSON.stringify(res2wr)).then(e => console.log(url, 'sent success'), console.log)
    },
    er => {
      libs.sendRabbit(rconn, receiveq, JSON.stringify({ err: er }))
      /* TODO сделать расширенную обработку ошибки - если ничего не пришло, если что-то не так...  */
    }
  )
}
amqp.connect(rabbiturl, (err, conn) => {
  // В одном цикле - коннектимся к рэббиту
  if (!err && conn) {
    rconn = conn
    conn.createChannel(
      (err, ch) => {
        if (err) {
          console.log('Error while connecting to Rabbit')
          process.exit(1)
        }
        console.log('AMQP Connected')
        ch.assertQueue(sendq, { durable: false })
        ch.consume(sendq, msg => {
          // Слушаем (!)
          const url = msg.content.toString()
          findDoc(
            url,
            e => {
              //console.log(e);
              let eurl = e[0].url
              let edata = e[0].data
              let qres = { url: eurl, data: edata }
              //console.log(qres);
              libs
                .sendRabbit(rconn, receiveq, JSON.stringify(qres))
                .then(e => console.log('sent from mongo success'), console.log)
            },
            e => readFromUrlSendRes(url)
          )
          /* берем  урл из очереди напрямую */
          // TODO CHECK IF NOT IN MONGO
          setTimeout(() => {
            ch.ack(msg)
          }, 1000)
        })
      },
      { noAck: true }
    )
  }
})
