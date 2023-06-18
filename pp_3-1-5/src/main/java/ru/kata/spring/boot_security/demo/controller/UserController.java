package ru.kata.spring.boot_security.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;


public class UserController {

    @GetMapping("/")
    public String index() {
        return "hz";
    }

    @GetMapping("/us")
    public String userPage() {
        return "user";
    }
}
