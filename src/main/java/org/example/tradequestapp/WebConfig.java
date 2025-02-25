package org.example.tradequestapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder.baseUrl("https://www.alphavantage.co").build();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry resourceHandlerRegistry) {
        resourceHandlerRegistry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
        resourceHandlerRegistry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/");
        resourceHandlerRegistry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/js/");
    }

}
