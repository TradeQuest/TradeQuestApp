/*package org.example.tradequestapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Authorize requests
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/", "/css/**","/images/**","/js/**", "/fragments/**", "/login").permitAll()
                                .anyRequest().permitAll()
                )
                // Configure OAuth2 login
                .oauth2Login(oauth2Login ->
                        oauth2Login
                                .loginPage("/LogIn")
                                .defaultSuccessUrl("/dashboard", true)
                ).logout(logout -> logout.logoutSuccessUrl("/").permitAll());
        return http.build();
    }
}*/
