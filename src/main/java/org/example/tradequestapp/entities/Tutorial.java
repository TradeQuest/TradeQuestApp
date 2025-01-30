package org.example.tradequestapp.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor

@Entity
@Table(name = "Tutorial")
public class Tutorial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tutoral_id", nullable = false, unique = true)
    private Long tutorial_id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "video_url")
    private String video_url;

    //RELATIONS
    @ManyToMany(mappedBy = "tutorials")
    private List<User> users = new ArrayList<>();

    //GETTER Y SETTER
    public Long getTutorial_id() {
        return tutorial_id;
    }

    public void setTutorial_id(Long tutorial_id) {
        this.tutorial_id = tutorial_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVideo_url() {
        return video_url;
    }

    public void setVideo_url(String video_url) {
        this.video_url = video_url;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
