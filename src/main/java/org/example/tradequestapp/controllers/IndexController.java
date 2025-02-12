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

    @GetMapping("/landingPage")
    public String landingPage(){return "LandingPage";}

    @GetMapping("/logIn")
    public String logIn(){
        return "LogIn";
    }

    @GetMapping("/market")
    public String market(){return "Market";}

    @GetMapping("/wallet")
    public String wallet(){return "Wallet";}

    @GetMapping("/policies")
    public String policies(){return "Policies";}

}
