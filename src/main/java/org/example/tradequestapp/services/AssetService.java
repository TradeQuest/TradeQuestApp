package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Asset;
import org.example.tradequestapp.entities.Company;
import org.example.tradequestapp.model.CompanyData;
import org.example.tradequestapp.model.StockData;
import org.example.tradequestapp.respositories.AssetRepository;
import org.example.tradequestapp.respositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class AssetService {

    private final AssetRepository assetRepository;

    @Autowired
    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public Asset saveAsset(Asset asset){
        return assetRepository.save(asset);
    }

    public List<Asset> getAllAssets(){
        return assetRepository.findAll();
    }

    public Asset getAssetByCompanySymbol(String symbol){
        return assetRepository.findByCompany_symbol(symbol);
    }

    public void deleteAsset(String symbol){
        assetRepository.delete(assetRepository.findByCompany_symbol(symbol));
    }

}
