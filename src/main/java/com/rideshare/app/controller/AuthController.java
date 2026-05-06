package com.rideshare.app.controller;

import com.rideshare.app.dto.LoginRequest;
import com.rideshare.app.dto.SignupRequest;
import com.rideshare.app.model.User;
import com.rideshare.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequest request){
        return authService.signup(request);
    }
    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

}
