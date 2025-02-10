package org.example.tradequestapp.respositories;

import org.example.tradequestapp.entities.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    void delete(Optional<Wallet> buId);
}
