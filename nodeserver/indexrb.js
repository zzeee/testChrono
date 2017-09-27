/**
 * Created by zzeee on 25.09.2017.
 Rabbit клиент считывателя CSV.
 */

const https = require('https');
const http = require('http');
const amqp = require('amqplib/callback_api');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const rabbiturl = 'amqp://localhost';
const mongourl = 'mongodb://localhost:27017/';
const sendq = 'hello';
const receiveq = 'hello2';

let dbconn = '';

MongoClient.connect(mongourl, (err, db) => { // Коннектимся к монго, подключение - в переменную.
    if (err) {
        console.log('Error while connecting to Mongo');
        process.exit(1);
    }
    assert.equal(null, err)
    dbconn = db
    console.log('Mongo connected');
    //   findDocuments(db, console.log);
});


/** считывает текстовый файл из внешнего ресурса, принимает url, возвращает промис, если бы не необходимость сохранять ответ -
 * можно было бы сразу писать  в поток*/
const readList = url => {
    return new Promise((okres, rej) => {
        let srv = http
        if (url.indexOf('https') >= 0) srv = https //  Урлы могут быть и http и https, выбираем нужный протокол
        let localAnswer = ''
        srv
            .get(url, res => {
                const {statusCode} = res
                if (statusCode !== 200) rej(new Error('bad server answer')) // TODO Сделать разбивку 404, итп
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

/** парсинг csv строки в JSON  в данной версии CSV считает: разделитель -  в параметре delim  кавычки не раскрывает
 * возвращает объект. Строки ответа могут быть разной длины.
 * */

const parse = (data, delim) => {
    let qa = data.split(/\r?\n/);
    let tline = [];
    for (let str of qa) {
        let param = str.split(delim);
        let line = [];
        for (let i = 0; i < param.length; i++) {
            let qatt = param[i];
            line[i] = qatt; /* такой перебор на будущее*/
        }
        tline.push(line);
    }
    return tline;
}

const findDocuments = callback => {
    // Get the documents collection
    const collection = dbconn.collection('documents')
    collection.find({}).toArray((err, docs) => {
        //console.log(db.listCollections());
        callback(docs)
    })
}


const insertCsv = (data, callback) => {
    const collection = dbconn.collection('documents')
    // Insert some documents
    collection.insertOne(data, (err, result) => {
        callback(result)
    })
}


amqp.connect(rabbiturl, (err, conn) => {
    if (!err && conn) {
        conn.createChannel(
            (err, ch) => {
                /**  ждем подключения через Rabbit */
                console.log('AMQP Connected');
                ch.assertQueue(sendq, {durable: false});
                ch.consume(sendq, (msg) => {
                    let url = msg.content.toString();
                    /* берем  урл из очереди напрямую*/
                    console.log(url);
                    let qres = readList(url).then(
                        e => {
                            let res2wr = {url: url, data: (JSON.stringify(parse(e, ',')))};
                            conn.createChannel((err2, ch2) => { /* пишем в обратку, ответ - вышеописанная структура*/
                                if (!err2) {
                                    ch2.assertQueue(receiveq, {durable: false});
                                    ch2.sendToQueue(receiveq, new Buffer(JSON.stringify(res2wr)));
                                    console.log('sent');
                                }
                                else console.log(err2);
                            })

                        },
                        er => {
                            // console.log(er)
                            /* TODO сделать обработку ошибки - если ничего не пришло, нет интернета итп */
                        }
                    );
                    setTimeout(() => {
                        ch.ack(msg)
                    }, 1000);
                })
            },
            {noAck: true}
        )
    }
})

