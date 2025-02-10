package org.example.tradequestapp.controllers;

import org.example.tradequestapp.entities.Wallet;
import org.example.tradequestapp.services.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/walletApi")
public class WalletController {

    private final WalletService walletService;

    @Autowired
    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/wallet")
    public ResponseEntity<Wallet> saveWallet(@RequestBody Wallet wallet){
        Wallet newWallet = walletService.saveWallet(wallet);
        return ResponseEntity.ok(newWallet);
    }

    @GetMapping("/wallets")
    public List<Wallet> getAllWallets(){return walletService.getAllWallets();}

    @GetMapping("/wallets/{id}")
    public ResponseEntity<Wallet> getWalletById(@PathVariable Long id){
        Optional<Wallet> wallet = walletService.getWalletById(id);
        return wallet.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/wallets/{id}")
    public ResponseEntity<String> deleteWallet(@PathVariable Long id){
        walletService.deleteWallet(id);
        return ResponseEntity.ok("Wallet deleted successfully");
    }

}
