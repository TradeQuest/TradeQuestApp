package org.example.tradequestapp.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "Asset")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id", nullable = false, unique = true)
    private Long asset_id;

    @Column(name = "current_value")
    private float current_value;

    @Column(name = "opening_value")
    private float opening_value;

    @Column(name = "lowest_value")
    private float lowest_value;

    @Column(name = "highest_value")
    private float highest_value;

    @Column(name = "volume")
    private float volume;

    //Relaciones


    public Asset(float opening_value, float lowest_value, float highest_value, float volume) {
        this.current_value = opening_value; //Porque no podemos coger el valor in real time
        this.opening_value = opening_value;
        this.lowest_value = lowest_value;
        this.highest_value = highest_value;
        this.volume = volume;
    }
}
