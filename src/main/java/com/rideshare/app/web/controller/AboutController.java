package com.rideshare.app.web.controller;

import com.rideshare.app.model.User;
import com.rideshare.app.repository.RideRepository;
import com.rideshare.app.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/about")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AboutController {
    private final UserRepository userRepository;
    private final RideRepository rideRepository;

    @GetMapping("/stats")
    public AboutStats stats() {
        User admin = userRepository.findByEmail("valentinocvetanovski18@gmail.com")
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        long sharedRidesByAdmin = rideRepository.countByDriverId(admin.getId());
        long activeUsers = userRepository.countByLastLoginAtAfter(LocalDateTime.now().minusMonths(1));

        long connectedCities = rideRepository.countDistinctFromCities()
                + rideRepository.countDistinctToCities()
                + 2;

        AboutStats stats = new AboutStats();
        stats.setSharedRides(sharedRidesByAdmin);
        stats.setActiveUsers(activeUsers);
        stats.setConnectedCities(connectedCities);

        return stats;
    }

    @GetMapping("/team")
    public List<User> team() {
        return userRepository.findByEmailIn(List.of(
                "valentinocvetanovski18@gmail.com",
                "theassassinowl2@gmail.com"
        ));
    }

    @Data
    public static class AboutStats {
        private long sharedRides;
        private long activeUsers;
        private long connectedCities;
    }
}