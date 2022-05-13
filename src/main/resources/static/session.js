'use strict';

var stompClient = null;
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var usernameForm = document.querySelector('#usernameForm');


//on page load connect
window.addEventListener('load', function() {
    connect();
});
 

function connect(event) {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

function onError() {
    console.log('STOMP error ');
}

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        var chatMessage = {
            sender: "Joseph",
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    console.log(message.content);
}

messageForm.addEventListener('submit', sendMessage, true)
usernameForm.addEventListener('submit', connect, true)


var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/java");

var stop = function () {
    var image = document.getElementById('image')
    var stream = video.srcObject;
    var tracks = stream.getTracks();
    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }
    video.srcObject = null;
    //set the image source to a blank image
    image.src = "https://suitabletech.com/images/HelpCenter/errors/Lenovo-Camera-Error.JPG";
}
var start = function () {
    var video = document.getElementById('video'),
        vendorUrl = window.URL || window.webkitURL;
    var image = document.getElementById('image')
    image.src = "";

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            }).catch(function (error) {
                console.log("Something went wrong!");
            });
    }
}
start();