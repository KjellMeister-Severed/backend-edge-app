const express = require('express');
const app = express();
const http = require('http');
const mqtt = require('mqtt');
const cors = require('cors');
const server = http.createServer(app);
let bodyParser = require('body-parser');
const {addLog} = require("./eventhandler");
app.use(bodyParser.json());
app.use(cors)
const port = 3000;
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
    client.subscribe(["/log", "/gate/toggle"], () => {
        console.log(`Subscribe to topic '/log'`)
    })
});

client.on('message', function (topic, message) {
    if (topic === "/log"){
        io.emit("log", `${new Date().toISOString().substring(0,19)} - ${JSON.parse(message.toString()).log}`)
    }    if (topic === "/gate/toggle"){
        console.log("gate got toggled")
    }
});


// ----------------------- //
//      SOCKET CONTROL     //
// ----------------------- //

io.on('connection', function (socket) {
    console.log("new connection established")
    socket.on('togglegate', (msg) => {
        console.log("here")
        client.publish("/gate/toggle", msg);
    });
});

// ----------------------- //
//    ENDPOINTS & LOGIC    //
// ----------------------- //

app.get('/logs', (req, res) => {
    res.send(JSON.stringify(latestLogs))
});

app.post('/logs', (req, res) => {
    addLog(req.body.description)
    res.status(200).end();
});

app.patch('/gate/:id', (req, res) => {
    client.publish('gate/state/' + req.params.id, 'toggle');
    res.status(200).end();
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});