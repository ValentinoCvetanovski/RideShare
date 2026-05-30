package com.rideshare.app.web.controller;

import com.rideshare.app.model.Ride;
import com.rideshare.app.model.User;
import com.rideshare.app.repository.RideRepository;
import com.rideshare.app.repository.UserRepository;
import com.rideshare.app.service.EmailService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final EmailService emailService;

    @PutMapping("/{id}/avatar")
    public User updateAvatar(@PathVariable Long id, @RequestBody UpdateAvatarRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatar(request.getAvatar());
        User savedUser = userRepository.save(user);

        List<Ride> rides = rideRepository.findByDriverId(id);
        for (Ride ride : rides) {
            ride.setDriverAvatar(request.getAvatar());
        }
        rideRepository.saveAll(rides);

        return savedUser;
    }

    @Data
    public static class UpdateAvatarRequest {
        private String avatar;
    }
    @PostMapping("/{id}/email/send-code")
    public EmailCodeResponse sendEmailCode(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new RuntimeException("User email is missing");
        }

        String code = String.valueOf((int) (10000 + Math.random() * 90000));

        user.setEmailVerified(false);
        user.setEmailVerificationCode(code);
        user.setEmailVerificationExpiresAt(java.time.LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);

        emailService.sendVerificationCode(user.getEmail(), code);

        EmailCodeResponse response = new EmailCodeResponse();
        response.setMessage("Verification code sent to your email.");
        return response;
    }

    @PostMapping("/{id}/email/verify")
    public User verifyEmail(@PathVariable Long id, @RequestBody VerifyEmailRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmailVerificationCode() == null) {
            throw new RuntimeException("No verification code requested.");
        }

        if (user.getEmailVerificationExpiresAt() == null ||
                user.getEmailVerificationExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Verification code expired.");
        }

        if (!user.getEmailVerificationCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid verification code.");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationCode(null);
        user.setEmailVerificationExpiresAt(null);

        return userRepository.save(user);
    }

    @lombok.Data
    public static class VerifyEmailRequest {
        private String code;
    }

    @lombok.Data
    public static class EmailCodeResponse {
        private String message;
    }
}