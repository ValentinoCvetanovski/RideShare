package com.rideshare.app.web.dto;

import lombok.Data;

@Data
public class CreateBookingRequest {
    private Long rideId;
    private Long passengerId;
    private Integer seatsBooked;
    private String paymentMethod;
}

