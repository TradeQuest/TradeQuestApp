package org.example.tradequestapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CompanyData {
    @JsonProperty("Symbol")
    private String symbol;
    @JsonProperty("Name")
    private String name;
    @JsonProperty("Description")
    private String description;
    @JsonProperty("OfficialSite")
    private String official_website;

    //GETTER Y SETTER
    public String getSymbol() {
        return symbol;
    }
    public String getName() {
        return name;
    }
    public String getDescription() {
        return description;
    }
    public String getOfficial_website() {
        return official_website;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setOfficial_website(String official_website) {
        this.official_website = official_website;
    }
}
