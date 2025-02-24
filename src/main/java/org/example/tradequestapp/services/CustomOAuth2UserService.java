package org.example.tradequestapp.services;

import jakarta.transaction.Transactional;
import org.example.tradequestapp.entities.User;
import org.example.tradequestapp.respositories.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private static final Logger logger = Logger.getLogger(CustomOAuth2UserService.class.getName());

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        Map<String, Object> attributes = oauth2User.getAttributes();
        String oauth2Id = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        logger.info("Datos recibidos de Google OAuth2 - ID: " + oauth2Id + ", Email: " + email + ", Nombre: " + name);

        Optional<User> existingUser = userRepository.findByOauth2Id(oauth2Id);

        if (existingUser.isEmpty()) {
            User newUser = new User();
            newUser.setOauth2Id(oauth2Id);
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setLevel(0);
            User savedUser = userRepository.save(newUser);
            logger.info("Nuevo usuario guardado en la base de datos con ID: " + savedUser.getUser_id());
        } else {
            logger.info("El usuario ya existe en la base de datos.");
        }

        return oauth2User;
    }
}

