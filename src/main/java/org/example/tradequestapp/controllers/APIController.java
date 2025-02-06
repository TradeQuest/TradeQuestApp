package org.example.tradequestapp.controllers;


import org.example.tradequestapp.model.CompanyData;
import org.example.tradequestapp.model.StockData;
import org.example.tradequestapp.services.APIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks")
public class APIController {
    /* private final APIService apiService;

    public APIController(APIService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/{symbol}/daily")
    public StockData getDailyStockData(@PathVariable String symbol) {
        return apiService.getStockData(APIService.FUNCTION_DAILY, symbol);
    }

    @GetMapping("/{symbol}/weekly")
    public StockData getWeeklyStockData(@PathVariable String symbol) {
        return apiService.getStockData(APIService.FUNCTION_WEEKLY, symbol);
    }

    @GetMapping("/{symbol}/monthly")
    public StockData getMonthlyStockData(@PathVariable String symbol) {
        return apiService.getStockData(APIService.FUNCTION_MONTHLY, symbol);
    }

    @GetMapping("/{symbol}/overview")
    public CompanyData getOverviewData(@PathVariable String symbol) {
        return apiService.getCompanyData(symbol);
    } */

}