package com.codecollab.app;

import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.codecollab.app.Model.SessionModel;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.util.WebUtils;

@Controller
public class Main {

	ArrayList<Integer> usedPins = new ArrayList<Integer>();
	HashMap<Integer, Boolean> sessionManagment = new HashMap<Integer, Boolean>();

	/**
	 * The Join Session page is the page in which the user can join a session. This
	 * is the first page
	 * the user can use to start joining sessions
	 * <p>
	 * This method always returns something, whether or not the
	 * if statment is met.
	 * 
	 * @param model               A model so we can pass into the view
	 * @param HttpServletResponse a response that helps with adding cookies
	 * @return a String that is the name of the view
	 */
	@RequestMapping(value = "/joinSession", method = { RequestMethod.GET, RequestMethod.POST })
	public String index(Model model, HttpServletResponse response) {
		model.addAttribute("SessionModel", new SessionModel());
		if (sessionManagment.containsKey(sessionManagment.get(0))) {
			Cookie cookie = new Cookie("sessionPin", Integer.toString(23948));
			response.addCookie(cookie);
			sessionManagment.put(23948, true);
			return "redirect:/session";
		}
		return "joinSession";
	}

	/**
	 * This is the first page the user sees when they enter the page
	 * In here the user can either join a session or create a new one
	 * <p>
	 * This method always returns the main view
	 * 
	 * @return a String that is the name of the view
	 */
	@GetMapping("/")
	public String homePage() {
		return "index";
	}

	/**
	 * The Session page is the page where the magic happens and the user can
	 * interact with the server and code in real time
	 * <p>
	 * This method always returns session view no matter what
	 * 
	 * @param sessionPin          the pin of the session
	 * @param HttpServletResponse a response that helps with adding cookies
	 * @param model               A model so we can pass into the view
	 * @return a String that is the name of the view
	 */
	@GetMapping("/session")
	public String session(@CookieValue(value = "sessionPin") String sessionPin, HttpServletResponse response,
			Model model) {
		model.addAttribute("pin", sessionPin);
		return "session";
	}

	/**
	 * The Generage pin is a sort of API-sih page where a pin is quicklu genertaed and saved in the browser
	 * before redirecting to the login page
	 * <p>
	 * This method always returns a redirect to the session page
	 * 
	 * @param HttpServletResponse a response that helps with adding cookies
	 * @return a simple redirect
	 */
	@RequestMapping(value = "/generatePin", method = { RequestMethod.GET, RequestMethod.POST })
	public String generatePin(HttpServletResponse response) throws FileNotFoundException, UnsupportedEncodingException {
		int sessionNumber = generateSecureNumber();
		Cookie cookie = new Cookie("sessionPin", Integer.toString(sessionNumber));
		response.addCookie(cookie);
		usedPins.add(sessionNumber);
		sessionManagment.put(sessionNumber, false);
		return "redirect:/session/";
	}

	/**
	 * This page closes the connection for the user and removes the cookie
	 * <p>
	 * This method always returns a redirect to the session page
	 * 
	 * @param sessionPin          the pin of the session
	 * @param HttpServletResponse a response that helps with adding cookies
	 * @return a simple redirect
	 */
	@RequestMapping(value = "/close")
	public String close(@CookieValue(value = "sessionPin") String sessionPin, HttpServletResponse response) {
		if (usedPins.size() >= 1) {
			usedPins.remove(0);
		}

		Cookie cookie = new Cookie("sessionPin", null);
		cookie.setPath("/");
		cookie.setMaxAge(0);
		response.addCookie(cookie);

		return "redirect:/";
	}

	
	/**
	 * This page creates a new session and redirects to the session page
	 * <p>
	 * This method can return the session page if there is a session with the same pin or it can return the create session page
	 * 
	 * @param HttpServletRequest a request that helps with getting cookies
	 * @return a simple redirect
	 */
	@GetMapping("/create")
	public String create(HttpServletRequest request) throws FileNotFoundException, UnsupportedEncodingException {
		Cookie currentSession = WebUtils.getCookie(request, "sessionPin");
		if (currentSession != null) {
			return "redirect:/session/";
		}
		return "create";
	}

	/**
	 * This is a helper method that generates a random number that is not in the
	 * usedPins array
	 * 
	 * @return a random number that is not in the usedPins array
	 */
	public int generateSecureNumber() {
		Random rdm = new Random();
		int randomNum = rdm.nextInt(900000) + 100000;
		if (usedPins.contains(randomNum)) {
			return generateSecureNumber();
		}
		return randomNum;
	}
}