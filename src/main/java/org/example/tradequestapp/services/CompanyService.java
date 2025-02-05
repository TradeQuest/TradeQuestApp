package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Company;
import org.example.tradequestapp.model.CompanyData;
import org.example.tradequestapp.respositories.CompanyRepository;
import org.springframework.stereotype.Service;


@Service
public class CompanyService {
    public CompanyRepository companyRepository;
    public APIService apiService;

    public void saveCompanyFromAPI(String symbol){
        CompanyData companyData = apiService.getCompanyData(symbol);

        Company company = convertToCompany(companyData);

        companyRepository.save(company);
    }

    public Company convertToCompany(CompanyData companyData){
        Company company = new Company();
        company.setName(companyData.getName());
        company.setSymbol(companyData.getSymbol());
        company.setDescription(companyData.getDescription());
        company.setOfficial_website(companyData.getOfficial_website());
        return company;
    }
}
