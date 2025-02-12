package org.example.tradequestapp.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor

@Entity
@Table(name = "Transaction")
public class Trade {

    enum TransactionType {
        COMPRA, VENTA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id", nullable = false, unique = true)
    private Long transaction_id;

    @Column(name = "transaction_type", nullable = false)
    private TransactionType transaction_type;

    @Column(name = "amount", nullable = false) //Cantidad de activo comprado/vendido
    private float asset_amount;

    @Column(name = "unit_price", nullable = false)
    private float unit_price;

    @Column(name = "transaction_date")
    private LocalDateTime transaction_date;

    //RELATIONS
    @ManyToOne
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "asset_id", referencedColumnName = "asset_id")
    private Asset asset;

    //CONSTRUCTOR
    public Trade(TransactionType transaction_type, float asset_amount, float unit_price, LocalDateTime transaction_date) {
        this.transaction_type = transaction_type;
        this.asset_amount = asset_amount;
        this.unit_price = unit_price;
        this.transaction_date = LocalDateTime.now();
    }

    //GETTER Y SETTER
    public Long getTransaction_id() {
        return transaction_id;
    }

    public void setTransaction_id(Long transaction_id) {
        this.transaction_id = transaction_id;
    }

    public TransactionType getTransaction_type() {
        return transaction_type;
    }

    public void setTransaction_type(TransactionType transaction_type) {
        this.transaction_type = transaction_type;
    }

    public float getAsset_amount() {
        return asset_amount;
    }

    public void setAsset_amount(float asset_amount) {
        this.asset_amount = asset_amount;
    }

    public float getUnit_price() {
        return unit_price;
    }

    public void setUnit_price(float unit_price) {
        this.unit_price = unit_price;
    }

    public LocalDateTime getTransaction_date() {
        return transaction_date;
    }

    public void setTransaction_date(LocalDateTime transaction_date) {
        this.transaction_date = transaction_date;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }


    /*
    * CODIGO PARA FORMATEAR LA FECHA A UN STRING
    * public String getFechaHoraFormateada() {
        DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return fechaHoraCreacion.format(formato);
    }
    * */
}
