package org.example.tradequestapp.services;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.tradequestapp.entities.User;
import org.example.tradequestapp.entities.UserRole;
import org.example.tradequestapp.respositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public CustomOAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();

        String oauth2Id = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        Optional<User> existingUser = userRepository.findByOauth2Id(oauth2Id);

        if (existingUser.isEmpty()) {
            User newUser = new User();
            newUser.setOauth2Id(oauth2Id);
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setUsername(name);
            newUser.setUser_role(UserRole.STUDENT);
            newUser.setLevel(0);
            newUser.setCurrent_lesson(0);
            userRepository.save(newUser);
        }

        response.sendRedirect("/dashboard"); // Redirigir al dashboard después del inicio de sesión
    }
}
