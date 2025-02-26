package org.example.tradequestapp.services;

import org.example.tradequestapp.entities.User;
import org.example.tradequestapp.entities.Wallet;
import org.example.tradequestapp.respositories.UserRepository;
import org.example.tradequestapp.respositories.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    @Autowired
    public UserService(UserRepository userRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    public User saveUser(User user) {
        // ✅ Crear una Wallet para el usuario nuevo
        Wallet newWallet = new Wallet();
        newWallet.setBalance(10000); // Balance inicial ficticio

        // ✅ Asignar el usuario a la wallet
        newWallet.setUser(user);

        // ✅ Asignar la Wallet al usuario
        user.setWallet(newWallet);

        // ✅ Guardamos el usuario (esto guardará la wallet automáticamente debido a la relación OneToOne)
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
