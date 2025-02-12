package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Wallet;
import org.example.tradequestapp.respositories.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WalletService {

    private final WalletRepository walletRepository;

    @Autowired
    public WalletService(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    public Wallet saveWallet(Wallet wallet){return walletRepository.save(wallet);}

    public List<Wallet> getAllWallets(){return walletRepository.findAll();}

    public Optional<Wallet> getWalletById(Long id){return walletRepository.findById(id);}

    public void deleteWallet(Long id){walletRepository.deleteById(id);}

}
