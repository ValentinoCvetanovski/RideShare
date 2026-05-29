package com.rideshare.app.web.controller;

import com.rideshare.app.model.Booking;
import com.rideshare.app.service.BookingService;
import com.rideshare.app.web.dto.CreateBookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public Booking create(@RequestBody CreateBookingRequest req) {
        return bookingService.create(req);
    }
    @GetMapping("/my/{passengerId}")
    public List<Booking> myBookings(@PathVariable Long passengerId) {
        return bookingService.getMyBookings(passengerId);
    }
    @DeleteMapping("/{bookingId}")
    public void cancel(@PathVariable Long bookingId)
    {
        bookingService.cancelBooking(bookingId);
    }

    @PostMapping("/{bookingId}/confirm")
    public Booking confirm(@PathVariable Long bookingId) {
        return bookingService.confirmBooking(bookingId);
    }
    @PostMapping("/{bookingId}/deny")
    public Booking deny(@PathVariable Long bookingId) {
        return bookingService.denyBooking(bookingId);
    }
}

