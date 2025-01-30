package org.example.tradequestapp.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "Company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id", nullable = false, unique = true)
    private Long company_id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "symbol", nullable = false, unique = true)
    private String symbol;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "official_website")
    private String official_website;

    public Company(String name, String symbol, String description, String official_website) {
        this.name = name;
        this.symbol = symbol;
        this.description = description;
        this.official_website = official_website;
    }
}
