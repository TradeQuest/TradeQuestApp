package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Trade;
import org.example.tradequestapp.respositories.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TradeService {

    private final TradeRepository transactionRepository;

    @Autowired
    public TradeService(TradeRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Trade saveTransaction(Trade transaction){
        return transactionRepository.save(transaction);
    }

    public List<Trade> getAllTransactions(){
        return transactionRepository.findAll();
    }

    public Optional<Trade> getTransactionById(Long id){
        return transactionRepository.findById(id);
    }

    public void deleteTransaction(Long id){
        transactionRepository.deleteById(id);
    }

}
