package org.example.tradequestapp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class CompanyService {
    /*private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }*/

    private final WebClient webClient;

    @Autowired
    public CompanyService(WebClient.Builder webClientBuilder) {
        /*List<String> listCompany = new ArrayList<>();
        listCompany.add("AAPL");
        listCompany.add("IBM");

        for(String s : listCompany){

        }*/
        this.webClient = webClientBuilder.baseUrl("https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=RI1SFBDF2XGFS8MR").build();
    }

    public Mono<String> getExampleData() {
        return this.webClient.get()
                .uri("/data")
                .retrieve()
                .bodyToMono(String.class);
    }
}
