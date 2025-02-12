package org.example.tradequestapp.respositories;

import org.example.tradequestapp.entities.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByCompany_symbol(String symbol);

    Asset findByCompany_symbolAndDate(String symbol, String date);
}
