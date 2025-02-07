package org.example.tradequestapp.model;

import java.time.LocalDate;
import java.util.Map;

public class StockDataResult {
    private final LocalDate lastRefreshed;
    private final Map<String, StockData> stockDataMap;

    public StockDataResult(LocalDate lastRefreshed, Map<String, StockData> stockDataMap) {
        this.lastRefreshed = lastRefreshed;
        this.stockDataMap = stockDataMap;
    }

    public LocalDate getLastRefreshed() {
        return lastRefreshed;
    }

    public Map<String, StockData> getStockDataMap() {
        return stockDataMap;
    }
}
