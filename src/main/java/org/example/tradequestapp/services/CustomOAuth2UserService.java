package org.example.tradequestapp.services;

import jakarta.transaction.Transactional;
import org.example.tradequestapp.entities.User;
import org.example.tradequestapp.respositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Delegate to the default service to load the user
        OAuth2User oauth2User = super.loadUser(userRequest);

        // Extract the attributes provided by the OAuth2 provider.
        // (Note: attribute keys may vary depending on the provider, e.g., "id" or "sub")
        Map<String, Object> attributes = oauth2User.getAttributes();
        String oauth2Id = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        // Check if the user already exists in the database; if not, create a new one.
        userRepository.findByOauth2Id(oauth2Id)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setOauth2Id(oauth2Id);
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setLevel(0);
                    return userRepository.save(newUser);
                });

        // Optionally, you could wrap oauth2User with your own implementation if you need to merge
        // additional details from appUser, but for many cases returning the default oauth2User is sufficient.
        return oauth2User;
    }
}
