package com.codecollab.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;


@SpringBootApplication(exclude = {ErrorMvcAutoConfiguration.class})
public class AppApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

	@GetMapping("/hello")
	public String index() {
		return "hello world";
	}
}
