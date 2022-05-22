package com.codecollab.app.Controller;

import com.codecollab.app.Model.ChatMessage;
import com.codecollab.app.Model.VideoStream;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.updateCode")
    @SendTo("/topic/private")
    public ChatMessage sendCode(@Payload ChatMessage codeValue) {
        return codeValue;
    }

}