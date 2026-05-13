package com.rideshare.app.model;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Id;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @ManyToOne @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    private Integer seatsBooked;
    private String paymentMethod; // IN_ADVANCE / IN_PERSON

    @Column(nullable = false)
    private String status = "ACTIVE";

}

