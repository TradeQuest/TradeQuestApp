package org.example.tradequestapp.controllers;


import org.example.tradequestapp.APIResponse;
import org.example.tradequestapp.services.APIService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/stocks")
public class APIController {
    private final APIService apiService;

    public APIController(APIService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/{symbol}/daily")
    public Mono<APIResponse> getDailyStockData(@PathVariable String symbol) {
        return apiService.getStockData(APIService.FUNCTION_DAILY, symbol);
    }

    @GetMapping("/{symbol}/weekly")
    public Mono<APIResponse> getWeeklyStockData(@PathVariable String symbol) {
        return apiService.getStockData(APIService.FUNCTION_WEEKLY, symbol);
    }

    @GetMapping("/{symbol}/monthly")
    public Mono<APIResponse> getMonthlyStockData(@PathVariable String symbol) {
        return apiService.getStockData(APIService.FUNCTION_MONTHLY, symbol);
    }

    @GetMapping("/{symbol}/overview")
    public Mono<APIResponse> getOverviewData(@PathVariable String symbol) {
        return apiService.getStockData(APIService.FUNCTION_OVERVIEW, symbol);
    }

}