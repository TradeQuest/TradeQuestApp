package org.example.tradequestapp;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.example.tradequestapp.model.DailyStockData;

import java.util.Map;

public class APIResponse {

    @JsonProperty("Time Series (Daily)")
    private Map<String, DailyStockData> timeSeriesDaily;


    //GETTER Y SETTER
    public Map<String, DailyStockData> getTimeSeriesDaily() {
        return timeSeriesDaily;
    }
    public void setTimeSeriesDaily(Map<String, DailyStockData> timeSeriesDaily) {
        this.timeSeriesDaily = timeSeriesDaily;
    }

}