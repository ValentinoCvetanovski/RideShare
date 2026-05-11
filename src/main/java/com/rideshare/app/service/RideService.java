package com.rideshare.app.service;

import com.rideshare.app.model.Ride;
import com.rideshare.app.model.User;
import com.rideshare.app.repository.RideRepository;
import com.rideshare.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideService {
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    public Ride createRide(Ride ride) {
        validateRide(ride);
        System.out.println("driverEmail from request = " + ride.getDriverEmail());
        // Probaj da go vrzesh ride so user po driverName
        if (ride.getDriverEmail() != null && !ride.getDriverEmail().isBlank()) {
            User user = userRepository.findByEmail(ride.getDriverEmail()).orElse(null);
            if (user != null) {
                ride.setDriver(user);
                ride.setDriverName(user.getFullName());
                if (user.getAvatar() != null && !user.getAvatar().isBlank()) {
                    ride.setDriverAvatar(user.getAvatar());
                }
            }
        }


        return rideRepository.save(ride);
    }

    private void validateRide(Ride ride) {
        if (ride.getFromLat() == null || ride.getFromLng() == null || ride.getToLat() == null || ride.getToLng() == null) {
            throw new IllegalArgumentException("Coordinates are required.");
        }

        if (ride.getFromLat() < -90 || ride.getFromLat() > 90 || ride.getToLat() < -90 || ride.getToLat() > 90) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90.");
        }

        if (ride.getFromLng() < -180 || ride.getFromLng() > 180 || ride.getToLng() < -180 || ride.getToLng() > 180) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180.");
        }

        boolean samePoint =
                Math.abs(ride.getFromLat() - ride.getToLat()) < 0.000001 &&
                        Math.abs(ride.getFromLng() - ride.getToLng()) < 0.000001;

        if (samePoint) {
            throw new IllegalArgumentException("Start and destination cannot be the same point.");
        }

        if (ride.getSeats() <= 0) {
            throw new IllegalArgumentException("Seats must be greater than 0.");
        }

        BigDecimal price = ride.getPrice();
        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price must be 0 or greater.");
        }
    }

    public List<Ride> searchRides(String fromCity, String fromCountry, String toCity, String toCountry) {
        return rideRepository.findByFromCityAndFromCountryAndToCityAndToCountry(
                fromCity, fromCountry, toCity, toCountry);
    }

    public List<Ride> searchRidesByDate(String fromCity, String fromCountry, String toCity, String toCountry, String date) {
        return rideRepository.findByFromCityAndFromCountryAndToCityAndToCountryAndDate(
                fromCity, fromCountry, toCity, toCountry, date);
    }

    public List<Ride> searchRidesWithSeats(String fromCity, String fromCountry, String toCity, String toCountry, Integer seats) {
        return rideRepository.findByFromCityAndFromCountryAndToCityAndToCountryAndSeatsGreaterThanEqual(
                fromCity, fromCountry, toCity, toCountry, seats);
    }

    public List<Ride> searchRidesByDateAndSeats(String fromCity, String fromCountry, String toCity, String toCountry, String date, Integer seats) {
        return rideRepository.findByFromCityAndFromCountryAndToCityAndToCountryAndDateAndSeatsGreaterThanEqual(
                fromCity, fromCountry, toCity, toCountry, date, seats);
    }
}
