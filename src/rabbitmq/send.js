#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

//connect to the RabbitMQ server
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    //we create a channel, which is where most of the API for getting things done resides:
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';
        var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: false
        });

        // we must declare a queue for us to send to; then we can publish a message to the queue:
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});