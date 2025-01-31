package org.example.tradequestapp.controllers;


import org.example.tradequestapp.APIResponse;
import org.example.tradequestapp.services.APIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/stocks")
public class APIController {
    private final APIService apiService;

    public APIController(APIService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/{symbol}/daily")
    public Mono<APIResponse> getDailyStockData(@RequestParam String symbol) {
        return apiService.getStockData(APIService.FUNCTION_DAILY, symbol);
    }

    @GetMapping("/{symbol}/weekly")
    public Mono<APIResponse> getWeeklyStockData(@RequestParam String symbol) {
        return apiService.getStockData(APIService.FUNCTION_WEEKLY, symbol);
    }

    @GetMapping("/{symbol}/daily")
    public Mono<APIResponse> getOverviewData(@RequestParam String symbol) {
        return apiService.getStockData(APIService.FUNCTION_DAILY, symbol);
    }

}