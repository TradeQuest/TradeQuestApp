package org.example.tradequestapp.respositories;

import org.example.tradequestapp.entities.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    void deleteById(Long id);
}