package org.example.tradequestapp.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "User")
public class User {

    enum Role {
        ADMIN, STUDENT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Nombre", nullable = false)
    private String name;

    @Column(name = "Apellido1", nullable = false)
    private String surname_1;
    @Column(name = "Apellido2", nullable = false)
    private String surname_2;

    @Column(name = "Contrasena", nullable = false)
    private String password;

    @Column(name = "Email", unique = true, nullable = false)
    private String email;

    @Column(name = "Rol", nullable = false)
    private Role user_role;

    @Column(name = "Nivel")
    private int level;


}
