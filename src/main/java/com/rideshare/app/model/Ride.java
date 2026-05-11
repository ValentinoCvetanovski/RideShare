package com.rideshare.app.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@Table(name = "ride")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromCity;
    private String fromCountry;
    private String toCity;
    private String toCountry;

    private Double fromLat;
    private Double fromLng;
    private Double toLat;
    private Double toLng;

    private LocalDate date;

    @Transient
    private String driverEmail;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime depTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime arrTime;

    private int seats;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private String driverName;

    @Column(columnDefinition = "TEXT")
    private String driverAvatar;

    private String carModel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private User driver;
}
