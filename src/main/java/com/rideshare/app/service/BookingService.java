package com.rideshare.app.service;

import com.rideshare.app.model.Booking;
import com.rideshare.app.model.Ride;
import com.rideshare.app.model.User;
import com.rideshare.app.repository.BookingRepository;
import com.rideshare.app.repository.RideRepository;
import com.rideshare.app.repository.UserRepository;
import com.rideshare.app.web.dto.CreateBookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public Booking create(CreateBookingRequest req) {
        Ride ride = rideRepository.findById(req.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        User passenger = userRepository.findById(req.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        if (req.getSeatsBooked() == null || req.getSeatsBooked() < 1 || req.getSeatsBooked() > ride.getSeats()) {
            throw new RuntimeException("Invalid seats");
        }

        ride.setSeats(ride.getSeats() - req.getSeatsBooked());
        rideRepository.save(ride);

        Booking b = new Booking();
        b.setRide(ride);
        b.setPassenger(passenger);
        b.setSeatsBooked(req.getSeatsBooked());
        b.setPaymentMethod(req.getPaymentMethod());

        return bookingRepository.save(b);
    }
}

