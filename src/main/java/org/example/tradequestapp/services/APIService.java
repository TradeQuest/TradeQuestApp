package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Asset;
import org.example.tradequestapp.entities.Company;
import org.example.tradequestapp.model.CompanyData;
import org.example.tradequestapp.model.StockData;
import org.example.tradequestapp.respositories.AssetRepository;
import org.example.tradequestapp.respositories.CompanyRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class APIService {
    // ENUM
    public static final String FUNCTION_DAILY = "TIME_SERIES_DAILY";
    public static final String FUNCTION_WEEKLY = "TIME_SERIES_WEEKLY";
    public static final String FUNCTION_MONTHLY = "TIME_SERIES_MONTHLY";
    public static final String FUNCTION_OVERVIEW = "OVERVIEW";
    private static final String[] SYMBOls = {"IBM"};
    private static final String API_KEY = "RI1SFBDF2XGFS8MR";

    private final WebClient webClient;
    private final CompanyRepository companyRepository;
    /*private final AssetRepository assetRepository;*/

    public APIService(WebClient webClient, CompanyRepository companyRepository, AssetRepository assetRepository) {
        this.webClient = webClient;
        this.companyRepository = companyRepository;
        /*this.assetRepository = assetRepository;*/
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

    @Scheduled(fixedRate = 5000)
    public void convertToCompany(){
        for(String symbol : SYMBOls){
            CompanyData companyData = getCompanyData(symbol);

            Company company = companyRepository.findBySymbol(companyData.getSymbol());
            if(company == null){
                Company company1 = new Company();
                company1.setName(companyData.getName());
                company1.setSymbol(companyData.getSymbol());
                company1.setOfficial_website(companyData.getOfficial_website());
                companyRepository.save(company1);
            }
        }
    }
}