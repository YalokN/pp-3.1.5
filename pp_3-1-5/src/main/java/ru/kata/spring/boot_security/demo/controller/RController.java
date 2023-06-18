package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
public class RController {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private UserService userService = new UserServiceImpl();

    private RoleService roleService = new RoleServiceImpl();

    @Autowired
    public void setUserService(UserServiceImpl userServiceImpl) {
        this.userService = userServiceImpl;
    }

    @Autowired
    public void setRoleService(RoleServiceImpl roleServiceImpl) {
        this.roleService = roleServiceImpl;
    }

    @GetMapping("/hz")
    public ResponseEntity<List<User>> showAllUsers() {
        List<User> users = userService.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<User> showAllUsers(Principal principal) {
        User authUser = userService.findByUsername(principal.getName());
        return new ResponseEntity(authUser, HttpStatus.OK);
    }

    @GetMapping("/hz/{id}")
    public ResponseEntity<User> getUse(@PathVariable Long id) {
        return new ResponseEntity<>(userService.findUserById(id), HttpStatus.OK);
    }

    @PostMapping("/hz")
    public ResponseEntity<HttpStatus> addNewUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/hz/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping("/hz/{id}")
    public ResponseEntity<HttpStatus> editUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.changeUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
