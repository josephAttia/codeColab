package com;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class CORS implements WebMvcConfigurer {
      //Allowing CORS to happen because sockets are being used and it important to do this
      @Override
      public void addCorsMappings(CorsRegistry registry) {
          registry.addMapping("/**").allowedMethods("*");
      }
}
