package org.example.tradequestapp.respositories;

import org.example.tradequestapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByOauth2Id(String oauth2Id);
}
