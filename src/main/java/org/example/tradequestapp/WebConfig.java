package org.example.tradequestapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final String LOGIN_PAGE = "/logIn";

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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/static/**", "/css/**", "/js/**")
                        .permitAll()
                        .requestMatchers("/admin")
                        .hasRole("ADMIN")
                        .anyRequest()
                        .authenticated())
                .formLogin(login -> login
                        .loginPage(LOGIN_PAGE).usernameParameter("correo").passwordParameter("contra")
                        .defaultSuccessUrl("/dashboard", true)
                        .permitAll());
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return new InMemoryUserDetailsManager(
                User.withUsername("eloyADMIN")
                        .password(passwordEncoder().encode("admin1"))
                        .roles("ADMIN")
                        .build()
                ,User.withUsername("jorgeADMIN")
                        .password(passwordEncoder().encode("admin"))
                        .roles("ADMIN")
                        .build()
                ,User.withUsername("youssefADMIN")
                        .password(passwordEncoder().encode("admin"))
                        .roles("ADMIN")
                        .build()
                ,User.withUsername("cristobalADMIN")
                        .password(passwordEncoder().encode("admin"))
                        .roles("ADMIN")
                        .build()
        );
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
