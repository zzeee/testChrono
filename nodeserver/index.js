/**
 * Created by zzeee on 25.09.2017.
 */

const https = require("https");
const http = require("http");
const querystring = require('querystring');
var amqp = require('amqplib/callback_api');
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var dbconn="";


/*
amqp.connect('amqp://localhost', function (err, conn) {
    if (!err && conn) {
        conn.createChannel(function (err, ch) {
            var q = 'hello';
            ch.assertQueue(q, {durable: false});
            ch.consume(q, function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
            }, {noAck: true});
        });
    }
});
*/

var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], (err, result)=>{

        //assert.equal(err, null);
        //assert.equal(3, result.result.n);
        //assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
};

const findDocuments = (callback)=>{
    // Get the documents collection
    const collection = dbconn.collection('documents');
    collection.find({}).toArray((err, docs)=>{
        //console.log(db.listCollections());
        callback(docs);
    });
}

var url = 'mongodb://localhost:27017/';





MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
//    insertDocuments(db,console.log);
    dbconn=db;
 //   findDocuments(db, console.log);
});

const insertCsv = function(data, callback) {
    const collection = dbconn.collection('documents');
    // Insert some documents
    collection.insertOne(data, (err, result)=>{
        callback(result);
    });
};



    http.createServer((req, res)=>{
    const param = "file=";
    let stp = req.url.indexOf(param) + param.length;
    let etp = req.url.indexOf('&', stp);
    let name = req.url.substring(stp, etp > 0 ? etp : req.url.length);
    let qres = readList(name).then((e) => {
      //  console.log("geted", e);

        let res2wr={nam:name, data:e}
        console.log(res2wr, typeof res2wr);

      //  insertCsv(res2wr,console.log);
        findDocuments((ee)=>{
            res.write(JSON.stringify(ee));
            res.end(); });
        //insertCsv([
            //{a : 1}, {a : 2}, {a : 3}
                //],console.log);
        res.write(e);
        //res.end();
    }, (er) => {
        res.write("No file");
        res.end();
    });
}).listen(8081);


function readList(url) {
    return new Promise((okres, rej) => {
        let localAnswer = "";
        https.get(url, (res) => {
            const {statusCode} = res;
            console.log(statusCode);
            if (statusCode != 200) rej(new Error('bad server answer'));// Сделать разбивку 404, итп

            res.on("data", e => {
                console.log(".", e.length, e.toString());
                localAnswer += e;
            });
            res.on("error", (e) => {
                rej(new Error('error'))
            });
            res.on("end", (e) => {
                console.log('ended');
                okres(localAnswer);
            });

        }).on("error", (e) => {
            console.log("error", rej(e));
        });
    });
}

