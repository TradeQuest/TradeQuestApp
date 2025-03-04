package org.example.tradequestapp.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    @GetMapping("/")
    public String index(){
        return "LandingPage";
    }

    @GetMapping("/configuration")
    public String configuration(){
        return "Configuration";
    }

    @GetMapping("/dashboard")
    public String dashboard(){
        return "Dashboard";
    }

    /*@GetMapping("/landingpage")
    public String landingPage(){return "LandingPage";}*/

    @GetMapping("/logIn")
    public String logIn(){
        return "LogIn";
    }

    @GetMapping("/market")
    public String market(){return "Market";}

    @GetMapping("/wallet")
    public String wallet(){return "Wallet";}

    @GetMapping("/faq")
    public String faq(){return "FAQ";}

    @GetMapping("/policies")
    public String policies(){return "Policies";}

    @GetMapping("/admin")
    public String admin(){return "Admin";}

    @GetMapping("/support")
    public String support(){return "Support";}

    @GetMapping("/tutorial")
    public String tutorial(){return "Tutorial";}






}
