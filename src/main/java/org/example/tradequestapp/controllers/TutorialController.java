package org.example.tradequestapp.controllers;

import org.example.tradequestapp.entities.Tutorial;
import org.example.tradequestapp.services.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tutorialApi")
public class TutorialController {

    private final TutorialService tutorialService;

    @Autowired
    public TutorialController(TutorialService tutorialService){this.tutorialService = tutorialService;}

    @PostMapping("/tutorial")
    public ResponseEntity<Tutorial> saveTutorial(@RequestBody Tutorial tutorial){
        Tutorial newTutorial = tutorialService.saveTutorial(tutorial);
        return ResponseEntity.ok(newTutorial);
    }

    @GetMapping("/tutorials")
    public List<Tutorial> getAllTutorials(){return tutorialService.getAllTutorials();}

    @GetMapping("/tutorials/{id}")
    public ResponseEntity<Tutorial> getTutorialById(@PathVariable Long id){
        Optional<Tutorial> tutorial = tutorialService.getTutorialById(id);
        return tutorial.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tutorials/{id}")
    public ResponseEntity<String> deleteTutorial(@PathVariable Long id){
        tutorialService.deleteTransaction(id);
        return ResponseEntity.ok("Tutorial deleted successfully");
    }

}
