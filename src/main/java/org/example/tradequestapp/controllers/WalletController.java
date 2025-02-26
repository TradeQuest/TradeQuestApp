package org.example.tradequestapp.controllers;

import org.example.tradequestapp.entities.Asset;
import org.example.tradequestapp.entities.Trade;
import org.example.tradequestapp.entities.Wallet;
import org.example.tradequestapp.services.WalletService;
import org.example.tradequestapp.respositories.AssetRepository;
import org.example.tradequestapp.respositories.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/walletApi")
public class WalletController {

    private final WalletService walletService;
    private final AssetRepository assetRepository;
    private final TradeRepository tradeRepository;

    @Autowired
    public WalletController(WalletService walletService, AssetRepository assetRepository, TradeRepository tradeRepository) {
        this.walletService = walletService;
        this.assetRepository = assetRepository;
        this.tradeRepository = tradeRepository;
    }

    // Guardar nueva Wallet en la base de datos
    @PostMapping("/wallet")
    public ResponseEntity<Wallet> saveWallet(@RequestBody Wallet wallet) {
        Wallet newWallet = walletService.saveWallet(wallet);
        return ResponseEntity.ok(newWallet);
    }

    // Obtener todas las Wallets
    @GetMapping("/wallets")
    public List<Wallet> getAllWallets() {
        return walletService.getAllWallets();
    }

    // Obtener Wallet por ID
    @GetMapping("/wallets/{id}")
    public ResponseEntity<Wallet> getWalletById(@PathVariable Long id) {
        Optional<Wallet> wallet = walletService.getWalletById(id);
        return wallet.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtener la wallet de un usuario por su ID
    @GetMapping("/wallets/user/{userId}")
    public ResponseEntity<Wallet> getWalletByUserId(@PathVariable Long userId) {
        Optional<Wallet> wallet = walletService.getWalletByUserId(userId);
        return wallet.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Eliminar Wallet por ID
    @DeleteMapping("/wallets/{id}")
    public ResponseEntity<String> deleteWallet(@PathVariable Long id) {
        walletService.deleteWallet(id);
        return ResponseEntity.ok("Wallet deleted successfully");
    }

    // Comprar acción
    @PostMapping("/wallets/{id}/comprar")
    public ResponseEntity<?> comprarAccion(@PathVariable Long id, @RequestBody Trade trade) {
        Optional<Wallet> walletOpt = walletService.getWalletById(id);

        if (walletOpt.isEmpty()) {
            return ResponseEntity.notFound().build(); // Retornar error si la Wallet no existe
        }

        Wallet wallet = walletOpt.get();
        float totalCost = trade.getUnit_price() * trade.getAsset_amount(); // Cálculo del costo total de la compra

        if (wallet.getBalance() < totalCost) {
            return ResponseEntity.badRequest().body("Fondos insuficientes!"); // Verificar si hay suficiente saldo
        }

        // Crear nuevo Asset para la Wallet
        Asset asset = new Asset();
        asset.setCompany_symbol(trade.getAsset().getCompany_symbol());
        asset.setOpening_value(trade.getUnit_price());
        asset.setClose_value(trade.getUnit_price());
        asset.setWallet(wallet);

        // Guardar Asset en la base de datos
        assetRepository.save(asset);

        // Asignar el Asset a la transacción y guardarla
        trade.setWallet(wallet);
        trade.setAsset(asset);
        tradeRepository.save(trade);

        // Restar saldo y actualizar Wallet
        wallet.getTransactions().add(trade);

        // Asegurar que la lista de assets no sea null antes de agregar
        if (wallet.getAssets() == null) {
            wallet.setAssets(new java.util.ArrayList<>());
        }
        wallet.getAssets().add(asset);
        wallet.setBalance(wallet.getBalance() - totalCost);

        walletService.saveWallet(wallet); // Guardar cambios en la base de datos

        return ResponseEntity.ok(wallet); // Retornar la Wallet actualizada
    }
}
