package com.rideshare.app.controller;

import com.rideshare.app.model.Ride;
import com.rideshare.app.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RideController {
    private final RideService rideService;

    @GetMapping
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }
    @PostMapping
    public Ride createRide(@RequestBody Ride ride){
        return rideService.createRide(ride);
    }
    @GetMapping("/search")
    public List<Ride> search(
            @RequestParam String fromCity,
            @RequestParam String fromCountry,
            @RequestParam String toCity,
            @RequestParam String toCountry,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Integer seats
    ) {
        if ((date == null || date.isBlank()) && seats == null) {
            return rideService.searchRides(fromCity, fromCountry, toCity, toCountry);
        }
        if (date == null || date.isBlank()) {
            return rideService.searchRidesWithSeats(fromCity, fromCountry, toCity, toCountry, seats);
        }
        if (seats == null) {
            return rideService.searchRidesByDate(fromCity, fromCountry, toCity, toCountry, date);
        }
        return rideService.searchRidesByDateAndSeats(fromCity, fromCountry, toCity, toCountry, date, seats);
    }
}
