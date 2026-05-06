package com.rideshare.app.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Data
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromCity;
    private String fromCountry;
    private String toCity;
    private String toCountry;
    private String date;
    private int seats;
    private BigDecimal price;
    private String driverName;
    private String carModel;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime depTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime arrTime;
}
