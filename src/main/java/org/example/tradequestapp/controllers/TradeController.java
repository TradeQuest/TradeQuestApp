package org.example.tradequestapp.controllers;

import org.example.tradequestapp.entities.Trade;
import org.example.tradequestapp.services.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactionApi")
public class TradeController {

    private final TradeService transactionService;

    @Autowired
    public TradeController(TradeService transactionService){this.transactionService = transactionService;}

    @PostMapping("/transaction")
    public ResponseEntity<Trade> saveTransaction(@RequestBody Trade transaction){
        Trade newTransaction = transactionService.saveTransaction(transaction);
        return ResponseEntity.ok(newTransaction);
    }

    @GetMapping("/transactions")
    public List<Trade> getAllTransactions(){return transactionService.getAllTransactions();}

    @GetMapping("/transactions/{id}")
    public ResponseEntity<Trade> getTransactionById(@PathVariable Long id){
        Optional<Trade> transaction = transactionService.getTransactionById(id);
        return transaction.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id){
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok("Transaction deleted successfully");
    }

}
