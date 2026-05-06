package com.rideshare.app.repository;

import com.rideshare.app.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByFromCityAndFromCountryAndToCityAndToCountry(
            String fromCity, String fromCountry, String toCity, String toCountry);

    List<Ride> findByFromCityAndFromCountryAndToCityAndToCountryAndDate(
            String fromCity, String fromCountry, String toCity, String toCountry, String date);

    List<Ride> findByFromCityAndFromCountryAndToCityAndToCountryAndSeatsGreaterThanEqual(
            String fromCity, String fromCountry, String toCity, String toCountry, Integer seats);

    List<Ride> findByFromCityAndFromCountryAndToCityAndToCountryAndDateAndSeatsGreaterThanEqual(
            String fromCity, String fromCountry, String toCity, String toCountry, String date, Integer seats);

}
