package org.example.tradequestapp.controllers;


import org.example.tradequestapp.APIResponse;
import org.example.tradequestapp.DailyStockData;
import org.example.tradequestapp.services.APIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
public class APIController {

    @Autowired
    private APIService apiService;

    @GetMapping("/{id}")
    public Mono<APIResponse> getIBMStockData(@RequestParam String id) {
        return apiService.getStockData(APIService.FUNCTION_DAILY, id);
    }
}