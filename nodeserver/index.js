/**
 * CSV parser's server.
 * @module main
*/

const amqp = require('amqplib/callback_api');
const MongoClient = require('mongodb').MongoClient
const libs = require('./libs.js');

/** @constant {string} rabbiturl строка соединения с кроликом */
const rabbiturl = 'amqp://localhost'
/** @constant {string}  mongourl строка соединения с монго */
const mongourl = 'mongodb://localhost:27017/'
/** @constant {string} exchangeq имя очереди в кролике */
const exchangeq = 'rpc_queue'

amqp.connect(rabbiturl, (err, conn) => { // Коннектимся к рэбиту
    if (err) {
        console.log('Error while connecting to Rabbit');
        process.exit(1)
    }
    MongoClient.connect(mongourl, (err1, db) => { // Коннектимся к монго
        if (err1) {
            console.log('Error while connecting to Mongo')
            process.exit(2)
        }

        console.log('Mongo connected')
        conn.createChannel((err, ch) => { // TODO доделать ситуацию обрыва связи
            const q = exchangeq;
            ch.assertQueue(q, {durable: false});
            ch.prefetch(1);
            console.log('Awaiting RPC requests');
            ch.consume(q, (msg) => {
                const url = (msg.content.toString());
                libs.parseUrl(db,url).then((e) => {// TODO реакция и на окей и ошибку - пока одинакова- отправка назад. в будущем логика поменяется
                        ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(e)), {correlationId: msg.properties.correlationId});
                    },
                    (e) => {
                        ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(e)), {correlationId: msg.properties.correlationId});
                    });
                ch.ack(msg);
            });
        });
    })
});