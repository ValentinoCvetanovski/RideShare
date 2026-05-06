package com.rideshare.app.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String fullName;
    private String phone;
    private String email;
    private String password;
    private String confirmPassword;
}
