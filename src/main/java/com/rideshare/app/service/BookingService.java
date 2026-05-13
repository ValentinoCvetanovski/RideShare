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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

        if (ride.getSeats() <= 0) {
            throw new RuntimeException("No seats available.");
        }
        if (req.getSeatsBooked() == null || req.getSeatsBooked() < 1) {
            throw new RuntimeException("Invalid seats.");
        }
        if (req.getSeatsBooked() > ride.getSeats()) {
            throw new RuntimeException("Not enough seats available.");
        }


        ride.setSeats(ride.getSeats() - req.getSeatsBooked());
        rideRepository.save(ride);

        Booking b = new Booking();
        b.setRide(ride);
        b.setPassenger(passenger);
        b.setSeatsBooked(req.getSeatsBooked());
        b.setPaymentMethod(req.getPaymentMethod());
        b.setStatus("ACTIVE");
        return bookingRepository.save(b);
    }
    public List<Booking> getMyBookings(Long passengerId) {
        return bookingRepository.findByPassengerIdOrderByIdDesc(passengerId);
    }
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            return; // веќе е откажан, не враќај seats пак
        }

        Ride ride = booking.getRide();
        ride.setSeats(ride.getSeats() + booking.getSeatsBooked());

        rideRepository.save(ride);

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

}

