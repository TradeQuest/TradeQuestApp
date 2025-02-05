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
    public APIService apiService;

    public void saveCompanyFromAPI(String function, String symbol){
        StockData assetData = apiService.getStockData(function, symbol);

        Asset asset = convertToAsset(assetData);

        assetRepository.save(asset);
    }

    public Asset convertToAsset(StockData assetData){
        Asset asset = new Asset();
        asset.setCompany_symbol(assetData);
        return asset;
    }
}
