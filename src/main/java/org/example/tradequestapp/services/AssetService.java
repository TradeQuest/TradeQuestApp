package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Asset;
import org.example.tradequestapp.entities.Company;
import org.example.tradequestapp.model.CompanyData;
import org.example.tradequestapp.model.StockData;
import org.example.tradequestapp.respositories.AssetRepository;
import org.example.tradequestapp.respositories.CompanyRepository;
import org.springframework.stereotype.Service;


@Service
public class AssetService {
    public AssetRepository assetRepository;
    public CompanyRepository companyRepository;
    public APIService apiService;

    public AssetService(AssetRepository assetRepository, CompanyRepository companyRepository, APIService apiService) {
        this.assetRepository = assetRepository;
        this.companyRepository = companyRepository;
        this.apiService = apiService;
    }

    public void saveCompanyFromAPI(String function, String symbol){
        StockData assetData = apiService.getStockData(function, symbol);
        CompanyData companyData = apiService.getCompanyData(symbol);
        Asset asset = convertToAsset(assetData, companyData);

        assetRepository.save(asset);
    }

    public Asset convertToAsset(StockData assetData, CompanyData companyData){
        Asset asset = new Asset();
        asset.setCompany_symbol(companyData.getSymbol());
        asset.setCompany(companyRepository.findBySymbol(companyData.getSymbol()));
        asset.setOpening_value(assetData.getOpen());
        asset.setHighest_value(assetData.getHigh());
        asset.setLowest_value(assetData.getLow());
        asset.setClose_value(assetData.getClose());
        asset.setVolume(assetData.getVolume());
        return asset;
    }
}
