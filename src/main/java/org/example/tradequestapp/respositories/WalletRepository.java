package org.example.tradequestapp.respositories;

import org.example.tradequestapp.entities.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    // Metodo para eliminar una wallet por ID (ya existía)
    void deleteById(Long id);

    // Metodo para obtener una wallet basada en el ID del usuario
    Optional<Wallet> findByUser_UserId(Long userId);

}
