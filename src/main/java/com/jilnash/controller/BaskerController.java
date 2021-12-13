package com.jilnash.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/basket")
public class BaskerController {

    @PostMapping
    public void changeProductCountInBasket(HttpServletResponse response, @RequestBody Map<String, String> map) {

        if (Integer.parseInt(map.get("count")) < 0)
            map.put("count", "0");

        Cookie cookie = new Cookie("product" + map.get("id"), map.get("count"));

        if (cookie.getValue().equals("0")) {

            cookie.setMaxAge(0);
            cookie.setValue(null);
        }

        response.addCookie(cookie);
    }
}
