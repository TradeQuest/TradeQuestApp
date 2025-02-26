package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.User;
import org.example.tradequestapp.respositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.springframework.security.core.userdetails.User.builder;

@Service
public class UserService  implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){this.userRepository = userRepository;}

    public User saveUser(User user){return userRepository.save(user);}

    public List<User> getAllUsers(){return userRepository.findAll();}

    public Optional<User> getUserById(Long id){return userRepository.findById(id);}

    public void deleteUser(Long id){userRepository.deleteById(id);}

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()){

            var userObj = user.get();
            return org.springframework.security.core.userdetails.User.builder()
                    .username(userObj.getUsername())
                    .password(userObj.getPassword())
                    .build();
        }else {
            throw new UsernameNotFoundException("User not found" + email);
        }
    }
}
