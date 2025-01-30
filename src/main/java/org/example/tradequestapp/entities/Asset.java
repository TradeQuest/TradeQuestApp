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

    enum AssetType {
        ACCIÓN, ETF
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id", nullable = false, unique = true)
    private Long asset_id;

    @Column(name = "company_symbol", nullable = false)
    private String company_symbol;

    @Column(name = "asset_type", nullable = false)
    private String asset_type;

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

    //RELATIONS
    @OneToOne(mappedBy = "asset")
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    //CONSTRUCTOR
    public Asset(float opening_value, float lowest_value, float highest_value, float volume) {
        this.current_value = opening_value; //Porque no podemos coger el valor in real time
        this.opening_value = opening_value;
        this.lowest_value = lowest_value;
        this.highest_value = highest_value;
        this.volume = volume;
    }

    //GETTER Y SETTER
    public Long getAsset_id() {
        return asset_id;
    }

    public void setAsset_id(Long asset_id) {
        this.asset_id = asset_id;
    }

    public String getCompany_symbol() {
        return company_symbol;
    }

    public void setCompany_symbol(String company_symbol) {
        this.company_symbol = company_symbol;
    }

    public String getAsset_type() {
        return asset_type;
    }

    public void setAsset_type(String asset_type) {
        this.asset_type = asset_type;
    }

    public float getCurrent_value() {
        return current_value;
    }

    public void setCurrent_value(float current_value) {
        this.current_value = current_value;
    }

    public float getOpening_value() {
        return opening_value;
    }

    public void setOpening_value(float opening_value) {
        this.opening_value = opening_value;
    }

    public float getLowest_value() {
        return lowest_value;
    }

    public void setLowest_value(float lowest_value) {
        this.lowest_value = lowest_value;
    }

    public float getHighest_value() {
        return highest_value;
    }

    public void setHighest_value(float highest_value) {
        this.highest_value = highest_value;
    }

    public float getVolume() {
        return volume;
    }

    public void setVolume(float volume) {
        this.volume = volume;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
