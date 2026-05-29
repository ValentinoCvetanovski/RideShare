package com.rideshare.app.service;

import com.rideshare.app.model.Booking;
import com.rideshare.app.model.Notification;
import com.rideshare.app.model.Ride;
import com.rideshare.app.model.User;
import com.rideshare.app.repository.BookingRepository;
import com.rideshare.app.repository.NotificationRepository;
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
    private final NotificationRepository notificationRepository;

    @Transactional
    public Booking create(CreateBookingRequest req) {

        Ride ride = rideRepository.findById(req.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        User passenger = userRepository.findById(req.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        if (req.getSeatsBooked() == null || req.getSeatsBooked() < 1) {
            throw new RuntimeException("Invalid seats.");
        }

        if (ride.getSeats() <= 0) {
            throw new RuntimeException("No seats available.");
        }

        if (req.getSeatsBooked() > ride.getSeats()) {
            throw new RuntimeException("Not enough seats available.");
        }

        if (ride.getDriver() == null) {
            throw new RuntimeException("This ride has no driver connected.");
        }

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setSeatsBooked(req.getSeatsBooked());
        booking.setPaymentMethod(req.getPaymentMethod());
        booking.setPickupLocation(req.getPickupLocation());
        booking.setPassengerNote(req.getPassengerNote());
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);

        Notification notification = new Notification();
        notification.setRecipient(ride.getDriver());
        notification.setBooking(savedBooking);
        notification.setType("BOOKING_REQUEST");
        notification.setTitle("New booking request");
        notification.setMessage(
                passenger.getFullName()
                        + " wants to book "
                        + req.getSeatsBooked()
                        + " seat(s) from "
                        + ride.getFromCity()
                        + " to "
                        + ride.getToCity()
                        + ". Pickup: "
                        + (req.getPickupLocation() == null || req.getPickupLocation().isBlank()
                        ? "Not provided"
                        : req.getPickupLocation())
        );

        notificationRepository.save(notification);

        return savedBooking;
    }
    public List<Booking> getMyBookings(Long passengerId) {
        return bookingRepository.findByPassengerIdOrderByIdDesc(passengerId);
    }
    @Transactional
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            return booking;
        }

        if ("DENIED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("This booking was already denied.");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("This booking was cancelled.");
        }

        Ride ride = booking.getRide();

        if (booking.getSeatsBooked() > ride.getSeats()) {
            throw new RuntimeException("Not enough seats available anymore.");
        }

        ride.setSeats(ride.getSeats() - booking.getSeatsBooked());
        rideRepository.save(ride);

        booking.setStatus("CONFIRMED");
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking denyBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Confirmed booking cannot be denied.");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            return booking;
        }

        booking.setStatus("DENIED");
        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            return;
        }

        if ("CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            Ride ride = booking.getRide();
            ride.setSeats(ride.getSeats() + booking.getSeatsBooked());
            rideRepository.save(ride);
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
}