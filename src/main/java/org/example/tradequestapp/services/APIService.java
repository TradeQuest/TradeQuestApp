package org.example.tradequestapp.services;

import org.example.tradequestapp.APIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class APIService {
    // ENUM
    public static final String FUNCTION_DAILY = "TIME_SERIES_DAILY";
    public static final String FUNCTION_WEEKLY = "TIME_SERIES_WEEKLY";
    public static final String FUNCTION_MONTHLY = "TIME_SERIES_MONTHLY";
    public static final String FUNCTION_OVERVIEW = "OVERVIEW";
    private static final String SYMBOL = "IBM";
    private static final String API_KEY = "RI1SFBDF2XGFS8MR";

    @Autowired
    private WebClient webClient;

    public Mono<APIResponse> getStockData(String function, String symbol) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", function)
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", API_KEY)
                        .build())
                .retrieve()
                .bodyToMono(APIResponse.class);
    }
}