package org.water.ex1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.water.ex1.service.PollutionSourceService;
import org.water.ex1.model.PollutionSource;

import java.util.List;

@RestController
public class PollutionSourceController {

    @Autowired
    private PollutionSourceService pollutionSourceService;

    //GET http://localhost:8080/pollution-sources
    @GetMapping("/pollution-sources")
    public List<PollutionSource> getPollutionSources() {
        return pollutionSourceService.getAllPollutionSources();
    }
}