package org.example.tradequestapp.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "Transaction")
public class Transaction {

    enum Type {
        COMPRA, VENTA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id", nullable = false, unique = true)
    private Long transaction_id;

    @Column(name = "transaction_type", nullable = false)
    private Type transaction_type;

    //Cantidad de activo comprado/vendido
    @Column(name = "amount", nullable = false)
    private float asset_amount;

    @Column(name = "unit_price", nullable = false)
    private float unit_price;

    @Column(name = "transaction_date")
    private LocalDateTime transaction_date;

    //Relación 1 a 1 wallet

    //Relación 1 a 1 Asset


    public Transaction(Long transaction_id, Type transaction_type, float asset_amount, float unit_price, LocalDateTime transaction_date) {
        this.transaction_id = transaction_id;
        this.transaction_type = transaction_type;
        this.asset_amount = asset_amount;
        this.unit_price = unit_price;
        this.transaction_date = LocalDateTime.now();
    }


    /*
    * CODIGO PARA FORMATEAR LA FECHA A UN STRING
    * public String getFechaHoraFormateada() {
        DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return fechaHoraCreacion.format(formato);
    }
    * */
}
