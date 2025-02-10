package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Transaction;
import org.example.tradequestapp.respositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction saveTransaction(Transaction transaction){
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions(){
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id){
        return transactionRepository.findById(id);
    }

    public void deleteTransaction(Long id){
        transactionRepository.delete(transactionRepository.findById(id));
    }

}
