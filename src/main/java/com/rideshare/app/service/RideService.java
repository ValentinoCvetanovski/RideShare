package com.rideshare.app.service;

import com.rideshare.app.model.Ride;
import com.rideshare.app.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RideService {
    private final RideRepository rideRepository;

    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
    public Ride createRide(Ride ride) {
        return rideRepository.save(ride);
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
