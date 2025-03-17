package org.water.ex1.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "weather_data")
public class WeatherData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String 날짜;
    private String 시간;
    private String 종류;
    private double 값;
    private double latitude;
    private double longitude;
    private double pollution_level;  // ✅ 오염률 추가
}

