package org.example.tradequestapp.controllers;

import org.example.tradequestapp.entities.Company;
import org.example.tradequestapp.services.AssetService;
import org.example.tradequestapp.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/companyApi")
public class CompanyController {

    private final CompanyService companyService;

    @Autowired
    public CompanyController(AssetService assetService, CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/company")
    public ResponseEntity<Company> saveAsset(@RequestBody Company company){
        Company newCompany = companyService.saveCompany(company);
        return ResponseEntity.ok(newCompany);
    }

    @GetMapping("/companies")
    public List<Company> getAllCompanies(){return companyService.getAllCompanies();}

    @GetMapping("/companies/{symbol}")
    public ResponseEntity<Company> getCompanySymbol(@PathVariable String symbol){
        Optional<Company> company = Optional.ofNullable(companyService.getCompanyBySymbol(symbol));
        return company.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/companies/{symbol}")
    public ResponseEntity<String> deleteCompany(@PathVariable String symbol) {
        companyService.deleteCompany(symbol);
        return ResponseEntity.ok("Company deleted successfully");
    }
}
