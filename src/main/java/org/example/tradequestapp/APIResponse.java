package org.example.tradequestapp;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.example.tradequestapp.model.StockData;

import java.util.Map;

public class APIResponse {

    @JsonProperty("Time Series (Daily)")
    private Map<String, StockData> timeSeriesDaily;

    //GETTER Y SETTER
    public Map<String, StockData> getTimeSeriesDaily() {
        return timeSeriesDaily;
    }
    public void setTimeSeriesDaily(Map<String, StockData> timeSeriesDaily) {
        this.timeSeriesDaily = timeSeriesDaily;
    }

}