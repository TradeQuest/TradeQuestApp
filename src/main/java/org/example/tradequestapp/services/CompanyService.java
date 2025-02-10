package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Company;
import org.example.tradequestapp.respositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Autowired
    public CompanyService(CompanyRepository companyRepository){
        this.companyRepository = companyRepository;
    }

    public Company saveCompany(Company company){
        return companyRepository.save(company);
    }

    public List<Company> getAllCompanies(){return companyRepository.findAll();}

    public Company getCompanyBySymbol(String symbol){return companyRepository.findBySymbol(symbol);}

    public void deleteCompany(String symbol) {companyRepository.delete(companyRepository.findBySymbol(symbol));}

}
