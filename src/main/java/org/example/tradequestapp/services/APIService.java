package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Asset;
import org.example.tradequestapp.entities.Company;
import org.example.tradequestapp.model.*;
import org.example.tradequestapp.respositories.AssetRepository;
import org.example.tradequestapp.respositories.CompanyRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class APIService {
    private static final int MAX_DAYS = 5;
    private static final String[] FUNCTIONs = {"TIME_SERIES_DAILY", "TIME_SERIES_WEEKLY", "TIME_SERIES_MONTHLY"};
    private static final String FUNCTION_OVERVIEW = "OVERVIEW";
    private static final String[] SYMBOLs = {
            "AAPL",  // Apple Inc.
            "MSFT",  // Microsoft Corporation
            //"AMZN",  // Amazon.com Inc.
            //"TSLA",  // Tesla Inc.
            //"NFLX",  // Netflix Inc.
            //"NVDA",  // NVIDIA Corporation
            //"AMD",   // Advanced Micro Devices Inc.
            //"INTC",  // Intel Corporation
            //"IBM",   // International Business Machines Corporation
            //"NKE",   // Nike Inc.
            //"MCD"// McDonald's Corporation
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

    public StockDataResult getStockData(String function, String symbol) {
        StockResponse response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", function)
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", API_KEY)
                        .build())
                .retrieve()
                .bodyToMono(StockResponse.class).block();

        if (response == null || response.getMetaData() == null) return new StockDataResult(null, Map.of());

        MetaData metaData = response.getMetaData();
        LocalDate lastRefreshed = metaData.getParsedLastRefreshed(); // 📌 Ahora se devuelve también

        // Determinar cuál "Time Series" usar
        Map<String, StockData> timeSeries = switch (function) {
            case "TIME_SERIES_DAILY" -> response.getTimeSeriesDaily();
            case "TIME_SERIES_WEEKLY" -> response.getTimeSeriesWeekly();
            case "TIME_SERIES_MONTHLY" -> response.getTimeSeriesMonthly();
            default -> Map.of();
        };

        if (timeSeries == null) return new StockDataResult(lastRefreshed, Map.of());

        // Filtrar los últimos 40 registros
        Map<String, StockData> filteredData = timeSeries.entrySet().stream()
                .limit(MAX_DAYS)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        return new StockDataResult(lastRefreshed, filteredData);
    }

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
                StockDataResult stockDataResult = getStockData(function, symbol);
                Map<String, StockData> stockDataMap = stockDataResult.getStockDataMap();
                LocalDate lastRefreshed = stockDataResult.getLastRefreshed(); // 📌 Ahora podemos usar esta fecha
                Company company = companyRepository.findBySymbol(symbol);

                if (company != null) {
                    for (Map.Entry<String, StockData> entry : stockDataMap.entrySet()) {
                        String date = entry.getKey(); // 📌 Fecha del dato
                        StockData stockData = entry.getValue();

                        Asset existingAsset = assetRepository.findByCompany_symbolAndDate(symbol, date);
                        if (existingAsset == null) {
                            Asset asset = new Asset();
                            asset.setCompany_symbol(symbol);
                            asset.setCompany(company);
                            asset.setDate(date);
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