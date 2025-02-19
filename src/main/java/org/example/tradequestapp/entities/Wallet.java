package org.example.tradequestapp.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Wallet")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallet_id", nullable = false, unique = true)
    private Long wallet_id;

    @Column(name = "balance", nullable = false)
    private float balance;

    //RELATIONS
    @OneToOne(mappedBy = "wallet")
    private User user;

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Trade> transactions = new ArrayList<>();

    //CONSTRUCTOR
    public Wallet() {
        this.balance = 10000;
    }

    //GETTER Y SETTER
    public Long getWallet_id() {
        return wallet_id;
    }

    public void setWallet_id(Long wallet_id) {
        this.wallet_id = wallet_id;
    }

    public float getBalance() {
        return balance;
    }

    public void setBalance(float balance) {
        this.balance = balance;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Trade> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Trade> transactions) {
        this.transactions = transactions;
    }
}
