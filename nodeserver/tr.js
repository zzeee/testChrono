
const amqp = require('amqplib/callback_api')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const libs = require('./libs.js')
/** @constant {string} */
const rabbiturl = 'amqp://localhost'
/** @constant {string}  */
const mongourl = 'mongodb://localhost:27017/'
/** @constant {string} */

amqp.connect(rabbiturl, (err, conn) => {
  // В одном цикле - коннектимся к рэббиту
  if (!err && conn) {
    rconn = conn
    conn.createChannel(
      (err, ch) => {

 var q = 'rpc_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    ch.consume(q, function reply(msg) {
      var n = parseInt(msg.content.toString());

      console.log(" [.] fib(%d)", n);

      var r = fibonacci(n);

      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(r.toString()),
        {correlationId: msg.properties.correlationId});

      ch.ack(msg);
    });
  });
}
}

);

function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}