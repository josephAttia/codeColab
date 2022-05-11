package com.codecollab;

import com.codecollab.app.SocketHandler;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
		public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
			SocketHandler sH = new SocketHandler();
			registry.addHandler(sH, "/user");
		}
}