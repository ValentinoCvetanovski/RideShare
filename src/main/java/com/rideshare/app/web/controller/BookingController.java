package com.rideshare.app.web.controller;

import com.rideshare.app.model.Booking;
import com.rideshare.app.service.BookingService;
import com.rideshare.app.web.dto.CreateBookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
}

