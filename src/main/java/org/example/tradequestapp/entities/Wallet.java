package org.example.tradequestapp.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    // ✅ Relaciones
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = true)
    @JsonIgnore
    private User user;


    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Trade> transactions = new ArrayList<>();

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Asset> assets = new ArrayList<>();

    // ✅ Constructor por defecto
    public Wallet() {
        this.balance = 0;
    }

    // ✅ GETTERS Y SETTERS
    public Long getWalletId() { // Antes era getWallet_id()
        return wallet_id;
    }

    public void setWalletId(Long walletId) { // Antes era setWallet_id()
        this.wallet_id = walletId;
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

    public List<Asset> getAssets() {
        if (this.assets == null) {
            this.assets = new ArrayList<>();
        }
        return this.assets;
    }

    public void setTransactions(List<Trade> transactions) {
        this.transactions = transactions;
    }

    public void setAssets(List<Asset> assets) {
        this.assets = assets;
    }
}
