var myWorker = new Worker('worker.js');
const notifyContainer = document.querySelector(".notifier");
const outputContainer = document.querySelector(".rhp");
const logsContainer = document.querySelector(".logs");
let sortFinished = false;
let sortStartTime;
let interval = Infinity;
let logs = [];
let count=0;
let timeInterval = Infinity;
const randomNumbers = [];

function generateRandomNumbers(min,max){
    for(let i=0;i<100000;i++){
        randomNumbers.push(Math.floor(Math.random()*(max-min)+min));
    }
}

generateRandomNumbers(1,100000000);

function start(){
    myWorker.postMessage({start:true,input:randomNumbers});
    sortStartTime = window.performance.now();
    startNumberSending();
}

function updateTimeInterval(event){
 interval = +event.target.value;
}

function startNumberSending(){
    const intervalId = setInterval(() => {
        const numberSend = Math.floor(Math.random()*100000);
        if(!sortFinished){  
        timeInterval = window.performance.now();
        myWorker.postMessage(numberSend);
        count++;
        }
        else{
            clearInterval(intervalId);
        }
    }, interval);

}


myWorker.onmessage = function(e){
    if(!e.data.isFinished){
        logs.push({time:window.performance.now()-timeInterval,value:e.data.value});
        appendMessage(notifyContainer,`received:${e.data.value}`);
     }
    else{
       sortFinished = true; 
       appendMessage(logsContainer,`total time taken: ${window.performance.now()-sortStartTime}`);
       printLogs();
       printOutput(e.data.value);
    }
};

function appendMessage(container,message){
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML=message;
    container.append(messageDiv);
}

function printOutput(outputArray){
    for(let number of outputArray){
        appendMessage(outputContainer,number);
    }
}

function printLogs(){
    for(let log of logs){
        appendMessage(logsContainer,`value:${log.value}  time:${log.time}`)
    }
}