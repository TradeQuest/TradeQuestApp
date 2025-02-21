package org.example.tradequestapp.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor

@Entity
@Table(name = "Usuario")
public class User {

    enum Role {
        ADMIN, STUDENT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", unique = true)
    private Long user_id;

    @Column(name = "nickname", unique = true)
    private String nickname;

    @Column(name = "oauth2Id", unique = true)
    private String oauth2Id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "password")
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "role")
    private Role user_role;

    @Column(name = "level")
    private int level;

    @Column(name = "current_lesson")
    private int current_lesson;

    //RELATIONS
    @ManyToMany
    @JoinTable(
            name = "user_tutorial",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "tutorial_id")
    )
    private List<Tutorial> tutorials = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "wallet_id", referencedColumnName = "wallet_id")
    private Wallet wallet;

    //CONSTRUCTOR
    public User(String nickname, String name, String surname, String password, String email, Role user_role, int level, String current_lesson) {
        this.nickname = nickname;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.email = email;
        this.user_role = Role.STUDENT;
        this.level = 0;
        this.current_lesson = 0;
    }

    //GETTER Y SETTER
    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getUser_role() {
        return user_role;
    }

    public void setUser_role(Role user_role) {
        this.user_role = user_role;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getCurrent_lesson() {
        return current_lesson;
    }

    public void setCurrent_lesson(int current_lesson) {
        this.current_lesson = current_lesson;
    }

    public List<Tutorial> getTutorials() {
        return tutorials;
    }

    public void setTutorials(List<Tutorial> tutorials) {
        this.tutorials = tutorials;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    public String getOauth2Id() {
        return oauth2Id;
    }

    public void setOauth2Id(String oauth2Id) {
        this.oauth2Id = oauth2Id;
    }
}
