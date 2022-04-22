package com.codecollab.app;
import java.util.ArrayList;
import java.util.Random;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.Session;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.thymeleaf.context.Context;

@Controller
public class Main{

    ArrayList<Integer> usedPins = new ArrayList<Integer>();


    @GetMapping("/joinSession")
    public String index(@CookieValue(value = "inSession", defaultValue = "false") String inSession, HttpServletResponse response) {
         return "joinSession";
    }

    @GetMapping("/")
    public String homePage(){
        return "index";
    }

    @GetMapping("/session")
    public String session(@CookieValue(value = "sessionPin") String sessionPin, HttpServletResponse response, Model model) {
        model.addAttribute("pin", sessionPin);
        return "session";
    }

    @RequestMapping(value = "/generatePin", method = {RequestMethod.GET, RequestMethod.POST})
    public String generatePin(HttpServletResponse response){
        int sessionNumber = generateSecureNumber();
        Cookie cookie = new Cookie("sessionPin", Integer.toString(sessionNumber));
        response.addCookie(cookie);
        return "redirect:/session/";
    }
    
    @GetMapping("/create")
    public String create(HttpServletResponse response){
        return "create";
    }


    public int  generateSecureNumber(){
        Random rdm = new Random();
        int randomNum = rdm.nextInt(900000) + 100000;
        if(usedPins.contains(randomNum)){
            return generateSecureNumber();
        }
        return randomNum;
    }

    public byte[] toByteArray(int value) {
        return new byte[] { 
            (byte)(value >> 24),
            (byte)(value >> 16),
            (byte)(value >> 8),
            (byte)value };
    }
    // packing an array of 4 bytes to an int, big endian, clean code
    public int fromByteArray(byte[] bytes) {
         return ((bytes[0] & 0xFF) << 24) | 
                ((bytes[1] & 0xFF) << 16) | 
                ((bytes[2] & 0xFF) << 8 ) | 
                ((bytes[3] & 0xFF) << 0 );
    } 
}

