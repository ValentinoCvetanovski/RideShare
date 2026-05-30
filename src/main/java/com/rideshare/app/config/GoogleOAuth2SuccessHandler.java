package com.rideshare.app.config;

import com.rideshare.app.model.User;
import com.rideshare.app.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String fullName = oauthUser.getAttribute("name");
        String avatar = oauthUser.getAttribute("picture");

        if (email == null || email.isBlank()) {
            response.sendRedirect("http://localhost:3000/login?error=google_email_missing");
            return;
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName != null ? fullName : email);
            newUser.setAvatar(avatar);
            newUser.setRole("USER");
            newUser.setPassword(passwordEncoder.encode("GOOGLE_LOGIN"));
            return userRepository.save(newUser);
        });

        if ((user.getAvatar() == null || user.getAvatar().isBlank()) && avatar != null && !avatar.isBlank()) {
            user.setAvatar(avatar);
            userRepository.save(user);
        }
        user.setLastLoginAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        String redirectUrl = "http://localhost:3000/oauth-success"
                + "?id=" + user.getId()
                + "&fullName=" + encode(user.getFullName())
                + "&email=" + encode(user.getEmail())
                + "&avatar=" + encode(user.getAvatar())
                + "&role=" + encode(user.getRole());

        response.sendRedirect(redirectUrl);
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }
}