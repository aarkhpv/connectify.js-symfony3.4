var app = require('express')(),
  express = require('express'),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'messageChannel';
    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      message = JSON.parse(msg.content.toString());
      console.log(" [x] Received with id %s", message.messageId);
      io.emit('message', { id : message.messageId, message : message.messageText });
    }, {noAck: true});
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
  console.log('http://localhost:3000');
});