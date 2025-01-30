package org.example.tradequestapp.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "Wallet")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallet_id", nullable = false, unique = true)
    private Long wallet_id;

    @Column(name = "balance", nullable = false)
    private float balance;

    //One to Many con Asset

    //Relacion 1 a 1 con User


    public Wallet(Long wallet_id, float balance) {
        this.wallet_id = wallet_id;
        this.balance = 0;
    }
}
