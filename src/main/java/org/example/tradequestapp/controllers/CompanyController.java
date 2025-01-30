package org.example.tradequestapp.controllers;

import org.example.tradequestapp.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;


@RestController
public class CompanyController {
    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/fetch-data")
    public Mono<String> fetchData() {
        return companyService.getExampleData();
    }



    /*@RequestMapping("/companies")
    public String obtainCompany(){
        String uri = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=RI1SFBDF2XGFS8MR";

        return "company";
    }

    @GetMapping("/company/{name}")
    public String obtainCompany(Model model){
        List<Company> companyList = new ArrayList<>();



        model.addAttribute(companyList.toString(), "companyList");
        return "company";
    }*/





}
