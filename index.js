const express = require('express');
const app = express();
const http = require('http');
const mqtt = require('mqtt');
const cors = require('cors');
const server = http.createServer(app);
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors)
const port = process.env.PORT || 3000;
let {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

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
    console.log('Connected to mqtt');
    client.subscribe(["/gate/toggle"], () => {
        console.log(`Subscribed to topic '/log'`)
    })
});

client.on('message', function (topic) {
    if (topic === "/gate/toggle"){
        io.emit("log", `${new Date().toISOString().substring(0,19)} - "Gate got Toggled"`)
    }
});


// ----------------------- //
//      SOCKET CONTROL     //
// ----------------------- //
io.on('connection', function (socket) {
    console.log("new connection established")
    socket.on('togglegate', (msg) => {
        client.publish("/gate/toggle", msg);
    });
});

server.listen(port, () => {
    console.log(`Example app listening at ${port}`);
});