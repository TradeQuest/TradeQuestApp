package org.example.tradequestapp.controllers;

import org.example.tradequestapp.entities.Asset;
import org.example.tradequestapp.services.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/assetApi")
public class AssetController {

    private final AssetService assetService;

    @Autowired
    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PostMapping("/asset")
    public ResponseEntity<Asset> saveAsset(@RequestBody Asset asset){
        Asset newAsset = assetService.saveAsset(asset);
        return ResponseEntity.ok(newAsset);
    }

    @GetMapping("/assets")
    public List<Asset> getAllAssets(){
        return assetService.getAllAssets();
    }

    @GetMapping("/assets/{company_symbol}")
    public ResponseEntity<Asset> getAssetByCompanySymbol(@PathVariable String symbol, @PathVariable String date){
        Optional<Asset> asset = Optional.ofNullable(assetService.getAssetBySymbolAndDate(symbol, date));
        return asset.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/assets/{company_symbol}")
    public ResponseEntity<String> deleteProduct(@PathVariable String symbol, @PathVariable String date){
        assetService.deleteAsset(symbol, date);
        return ResponseEntity.ok("Asset deleted successfully");
    }

}