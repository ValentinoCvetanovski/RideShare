package com.rideshare.app.web.controller;

import com.rideshare.app.model.Ride;
import com.rideshare.app.model.User;
import com.rideshare.app.repository.RideRepository;
import com.rideshare.app.repository.UserRepository;
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
}