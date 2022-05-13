package com.codecollab.app;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Random;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.WebUtils;

import io.socket.engineio.client.transports.WebSocket;

@Controller
public class Main {

	ArrayList<Integer> usedPins = new ArrayList<Integer>();

	WebSocket socket;

	// Join Session Page
	// @pram sessionId
	// @pram GET request
	// @pram POST request
	// @return joinSession.html
	@RequestMapping(value = "/joinSession", method = {
			RequestMethod.GET,
			RequestMethod.POST
	})
	public String index(@RequestParam(required = false, name = "pincode") String pincode, HttpServletRequest request,
			Model model) {
		return "joinSession";
	}

	// Home page
	@GetMapping("/")
	public String homePage() {
		System.out.println(usedPins);
		return "index";
	}

	@GetMapping("/session")
	public String session(@CookieValue(value = "sessionPin") String sessionPin, HttpServletResponse response,
			Model model) {
		model.addAttribute("pin", sessionPin);
		return "session";
	}

	@RequestMapping(value = "/generatePin", method = { RequestMethod.GET, RequestMethod.POST })
	public String generatePin(HttpServletResponse response) throws FileNotFoundException, UnsupportedEncodingException {
		int sessionNumber = generateSecureNumber();
		Cookie cookie = new Cookie("sessionPin", Integer.toString(sessionNumber));
		response.addCookie(cookie);
		usedPins.add(sessionNumber);
		PrintWriter writer = new PrintWriter("sessionManagment.txt", "UTF-8");
		writer.println("Session Pin: " + sessionNumber);
		writer.println("1");
		writer.close();
		return "redirect:/session/";
	}

	@RequestMapping(value = "/close")
	public String close(@CookieValue(value = "sessionPin") String sessionPin, HttpServletResponse response) {
		if (usedPins.size() >= 1) {
			usedPins.remove(0);
		}

		Cookie cookie = new Cookie("sessionPin", null);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setMaxAge(0);
		response.addCookie(cookie);

		return "redirect:/";
	}

	@GetMapping("/create")
	public String create(HttpServletRequest request) throws FileNotFoundException, UnsupportedEncodingException {
		Cookie currentSession = WebUtils.getCookie(request, "sessionPin");
		if (currentSession != null) {
			PrintWriter writer = new PrintWriter("sessionManagment.txt", "UTF-8");
			writer.println("Session Pin: " + currentSession.getValue());
			writer.println("1");
			writer.close();
			return "redirect:/session/";
		}
		return "create";
	}

	public int generateSecureNumber() {
		Random rdm = new Random();
		int randomNum = rdm.nextInt(900000) + 100000;
		if (usedPins.contains(randomNum)) {
			return generateSecureNumber();
		}
		return randomNum;
	}

	public byte[] toByteArray(int value) {
		return new byte[] {
				(byte) (value >> 24),
				(byte) (value >> 16),
				(byte) (value >> 8),
				(byte) value
		};
	}

	// packing an array of 4 bytes to an int, big endian, clean code
	public int fromByteArray(byte[] bytes) {
		return ((bytes[0] & 0xFF) << 24) |
				((bytes[1] & 0xFF) << 16) |
				((bytes[2] & 0xFF) << 8) |
				((bytes[3] & 0xFF) << 0);
	}

}