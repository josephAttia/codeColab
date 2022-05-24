'use strict';

var stompClient = null;
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var peerVideo = document.querySelector("#peerVideo");
var editor = ace.edit("editor");
var username = null;

//on page load connect
window.addEventListener('load', function() {
    connect();
    username = prompt('Enter your name:');
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
    stompClient.subscribe('/topic/private', onCodeReceived);
}

function sendMessage(event) {

    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function updateCode() {
    var code = editor.getValue();
    var json = JSON.stringify(code);
    if (stompClient) {
        var codeEditorValue = {
            sender: username,
            content: json,
            type: "CHAT "
        }
        stompClient.send("/app/chat.updateCode", {}, JSON.stringify(codeEditorValue));
    }

}

function onMessageReceived(payload) {
    var textArea = document.querySelector('#text_box');
    var message = JSON.parse(payload.body);
    textArea.value += message.sender + ": " + message.content + "\n";
}

function onCodeReceived(payload) {
    var clone = JSON.parse(payload.body);
    var code = clone.content;
    code = code.replaceAll("\\n", "lol");
    code = code.replaceAll("\\", "");
    code = code.slice(1, -1);
    code = code.replaceAll("lol", "\n");


    editor.setValue(code);

    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

messageForm.addEventListener('submit', sendMessage, true)

// add key listener to whole document
document.addEventListener('keydown', function(event) {
    //if ctrl and enter are pressed call updatecode 
    if (event.ctrlKey && event.keyCode == 13) {
        updateCode();
    }
});


editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/java");
