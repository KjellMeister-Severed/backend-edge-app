"use strict";
let logs = [{
    time: Date.now().toString(),
    description: "This is an example log"
}];

function getLogs(){
    if (logs.length <= 20){
        return logs;
    }else return logs.slice(0, 20);
}

function addLog(description){
    logs.push({
        time: Date.now().toString(),
        description: description
    });
}

module.exports = {
    getLogs, addLog
}