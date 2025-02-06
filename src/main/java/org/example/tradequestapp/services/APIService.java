package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Asset;
import org.example.tradequestapp.entities.Company;
import org.example.tradequestapp.model.CompanyData;
import org.example.tradequestapp.model.StockData;
import org.example.tradequestapp.model.StockResponse;
import org.example.tradequestapp.respositories.AssetRepository;
import org.example.tradequestapp.respositories.CompanyRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class APIService {
    // ENUM
    public static final String[] FUNCTIONs = {"TIME_SERIES_DAILY", "TIME_SERIES_WEEKLY", "TIME_SERIES_MONTHLY"};
    public static final String FUNCTION_OVERVIEW = "OVERVIEW";
    private static final String[] SYMBOLs = {
            "AAPL",  // Apple Inc.
            "MSFT",  // Microsoft Corporation
            "GOOGL", // Alphabet Inc. (Google)
            "AMZN",  // Amazon.com Inc.
            "TSLA",  // Tesla Inc.
            "NFLX",  // Netflix Inc.
            "NVDA",  // NVIDIA Corporation
            "AMD",   // Advanced Micro Devices Inc.
            "INTC",  // Intel Corporation
            "IBM",   // International Business Machines Corporation
            "NKE",   // Nike Inc.
            "MCD",   // McDonald's Corporation
    };
    private static final String API_KEY = "RI1SFBDF2XGFS8MR";

    private final WebClient webClient;
    private final CompanyRepository companyRepository;
    private final AssetRepository assetRepository;

    public APIService(WebClient webClient, CompanyRepository companyRepository, AssetRepository assetRepository) {
        this.webClient = webClient;
        this.companyRepository = companyRepository;
        this.assetRepository = assetRepository;
    }

    public Map<String, StockData> getStockData(String function, String symbol) {
        StockResponse response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", function)
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", API_KEY)
                        .build())
                .retrieve()
                .bodyToMono(StockResponse.class).block();

        if (response == null) return new LinkedHashMap<>();

        // Determinar cuál "Time Series" usar
        Map<String, StockData> timeSeries = switch (function) {
            case "TIME_SERIES_DAILY" -> response.getTimeSeriesDaily();
            case "TIME_SERIES_WEEKLY" -> response.getTimeSeriesWeekly();
            case "TIME_SERIES_MONTHLY" -> response.getTimeSeriesMonthly();
            default -> new LinkedHashMap<>();
        };

        if (timeSeries == null) return new LinkedHashMap<>();

        // Obtener los últimos 40 registros
        return timeSeries.entrySet().stream()
                .limit(40)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    /*public StockData getStockData(String function, String symbol) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", function)
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", API_KEY)
                        .build())
                .retrieve()
                .bodyToMono(StockData.class).block();
    }*/

    public CompanyData getCompanyData(String symbol) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", FUNCTION_OVERVIEW)
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", API_KEY)
                        .build())
                .retrieve()
                .bodyToMono(CompanyData.class).block();
    }

    @Scheduled(fixedRate = 86400000)
    public void convertToCompany() {
        for (String symbol : SYMBOLs) {
            CompanyData companyData = getCompanyData(symbol);

            Company company = companyRepository.findBySymbol(companyData.getSymbol());
            if (company == null) {
                Company company1 = new Company();
                company1.setName(companyData.getName());
                company1.setSymbol(symbol);
                company1.setOfficial_website(companyData.getOfficial_website());
                companyRepository.save(company1);
            }else{
                throw new RuntimeException("Company already exists");
            }
        }
    }

    @Scheduled(fixedRate = 86400000)
    public void convertToAsset() {
        for (String function : FUNCTIONs) {
            for (String symbol : SYMBOLs) {
                Map<String, StockData> stockDataMap = getStockData(function, symbol);
                Company company = companyRepository.findBySymbol(symbol);

                if (company != null) {
                    for (Map.Entry<String, StockData> entry : stockDataMap.entrySet()) {
                        String date = entry.getKey(); // Fecha del stock data
                        StockData stockData = entry.getValue();

                        // Verificar si el Asset ya existe para esta fecha y empresa
                        Asset existingAsset = assetRepository.findByCompany_symbolAndDate(symbol, date);
                        if (existingAsset == null) {
                            Asset asset = new Asset();
                            asset.setCompany_symbol(symbol);
                            asset.setCompany(company);
                            asset.setOpening_value(stockData.getOpen());
                            asset.setHighest_value(stockData.getHigh());
                            asset.setLowest_value(stockData.getLow());
                            asset.setClose_value(stockData.getClose());
                            asset.setVolume(stockData.getVolume());

                            assetRepository.save(asset);
                        }
                    }
                } else {
                    throw new RuntimeException("Company not found for symbol: " + symbol);
                }
            }
        }
    }
}