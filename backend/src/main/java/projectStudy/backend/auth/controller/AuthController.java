package projectStudy.backend.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import projectStudy.backend.auth.service.AuthService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor 
@RequestMapping("/auth")
public class AuthController {
    
    private final AuthService authService;

    
}
