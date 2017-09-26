/**
 * Created by zzeee on 25.09.2017.
 */

const https = require('https')
const http = require('http')
//const querystring = require('querystring')
const amqp = require('amqplib/callback_api')

const rabbiturl = 'amqp://localhost'
const mongourl = 'mongodb://localhost:27017/'
const MongoClient = require('mongodb').MongoClient,
  assert = require('assert')

let dbconn = ''
amqp.connect(rabbiturl, (err, conn) => {
  if (!err && conn) {
    //console.log('Connected correctly to server AMQP')
    conn.createChannel(
      (err, ch) => {
        var q = 'hello'
        ch.assertQueue(q, { durable: false })
        ch.consume(q, function(msg) {
          let url = msg.content.toString()
          i++
          console.log('i:', i, url)

          // console.log(' [x] Received %s', msg.content.toString())
          let qres = readList(url).then(
            e => {
              //  console.log("geted", e);
              let res2wr = { url: url, data: e }
              //        console.log(res2wr, typeof res2wr);
              //  insertCsv(res2wr,console.log);
              //        findDocuments(ee => {
              //        res.write(JSON.stringify(ee))
              //      res.end()
              //  })
              //insertCsv([
              //{a : 1}, {a : 2}, {a : 3}
              //],console.log);
              //res.write(e)
              // console.log(res2wr)
              conn.createChannel(function(err, ch2) {
                var q = 'hello2'
                ch2.assertQueue(q, { durable: false })
                ch2.sendToQueue(q, new Buffer(JSON.stringify(res2wr)))
                console.log('sent')
              })
              //res.end();
            },
            er => {
              //        res.write('No file')
              //      res.end()
              // console.log('err')
              // console.log(er)
            }
          )
          setTimeout(function() {
            /*    console.log(" [x] Done");*/ ch.ack(msg)
          }, 1 * 1000)
        })
      },
      { noAck: true }
    )
  }
})

const findDocuments = callback => {
  // Get the documents collection
  const collection = dbconn.collection('documents')
  collection.find({}).toArray((err, docs) => {
    //console.log(db.listCollections());
    callback(docs)
  })
}

MongoClient.connect(mongourl, (err, db) => {
  assert.equal(null, err)
  dbconn = db
  //   findDocuments(db, console.log);
})

const insertCsv = function(data, callback) {
  const collection = dbconn.collection('documents')
  // Insert some documents
  collection.insertOne(data, (err, result) => {
    callback(result)
  })
}

function readList(url) {
  return new Promise((okres, rej) => {
    let srv = http
    if (url.indexOf('https') >= 0) srv = https //  Урлы могут быть и http и https, выбираем нужный протокол
    let localAnswer = ''
    srv
      .get(url, res => {
        const { statusCode } = res
        if (statusCode !== 200) rej(new Error('bad server answer')) // Сделать разбивку 404, итп
        res.on('data', e1 => {
          localAnswer += e1
        })
        res.on('end', () => okres(localAnswer))
        res.on('error', e => {
          rej(new Error('error'))
        })
      })
      .on('error', e => {
        console.log('error', rej(e))
      })
  })
}
