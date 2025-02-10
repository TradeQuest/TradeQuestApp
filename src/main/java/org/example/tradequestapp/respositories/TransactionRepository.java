package org.example.tradequestapp.respositories;

import org.example.tradequestapp.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    void delete(Optional<Transaction> byId);
}