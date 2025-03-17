package org.water.ex1.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.water.ex1.model.WeatherData;
import org.water.ex1.repository.WeatherRepository;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:3000")  // React와 CORS 설정
public class WeatherController {
    private final WeatherRepository weatherRepository;

    public WeatherController(WeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    //http://localhost:8080/api/weather/data
    @GetMapping("/data")
    public List<WeatherData> getWeatherData() {
        return weatherRepository.findAll();
    }
}