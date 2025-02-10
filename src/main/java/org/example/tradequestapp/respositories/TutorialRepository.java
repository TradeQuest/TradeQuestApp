package org.example.tradequestapp.respositories;

import org.example.tradequestapp.entities.Tutorial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TutorialRepository extends JpaRepository<Tutorial, Long> {
    void delete(Optional<Tutorial> byId);
}
