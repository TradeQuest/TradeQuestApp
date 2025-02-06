package org.example.tradequestapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class StockResponse {
    @JsonProperty("Meta Data")
    private Map<String, String> metaData;

    @JsonProperty("Time Series (Daily)")
    private Map<String, StockData> timeSeriesDaily;

    @JsonProperty("Time Series (Weekly)")
    private Map<String, StockData> timeSeriesWeekly;

    @JsonProperty("Time Series (Monthly)")
    private Map<String, StockData> timeSeriesMonthly;

    public Map<String, String> getMetaData() {
        return metaData;
    }

    public Map<String, StockData> getTimeSeriesDaily() {
        return timeSeriesDaily;
    }

    public Map<String, StockData> getTimeSeriesWeekly() {
        return timeSeriesWeekly;
    }

    public Map<String, StockData> getTimeSeriesMonthly() {
        return timeSeriesMonthly;
    }
}

