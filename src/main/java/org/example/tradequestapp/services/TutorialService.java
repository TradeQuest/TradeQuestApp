package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.Tutorial;
import org.example.tradequestapp.respositories.TutorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TutorialService {

    private final TutorialRepository tutorialRepository;

    @Autowired
    public TutorialService(TutorialRepository tutorialRepository){this.tutorialRepository = tutorialRepository;}

    public Tutorial saveTutorial(Tutorial tutorial){return tutorialRepository.save(tutorial);}

    public List<Tutorial> getAllTutorials(){return tutorialRepository.findAll();}

    public Optional<Tutorial> getTutorialById(Long id){return tutorialRepository.findById(id);}

    public void deleteTransaction(Long id){tutorialRepository.deleteById(id);}

}
