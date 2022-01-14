const express = require('express');
const app = express();
const http = require('http');
const mqtt = require('mqtt');
const server = http.createServer(app);
const port = 3000



// ----------------------- //
//      MQTT CONTROLS      //
// ----------------------- //
let client = mqtt.connect({
    host: 'ffca62ab118149a9b9e2b927e3b7712d.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'EdgeGroep6',
    password: 'EdgeGroep6!'
});

client.on('connect', function (){
    console.log('Connected to mqtt')
})

client.on('message', function (topic, message) {
    console.log('Received message: ', topic, message.toString())
})

// ----------------------- //
//        ENDPOINTS        //
// ----------------------- //
app.get('/gate', (req, res) => {
    client.publish('gate/state', 'GateState changed')
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})