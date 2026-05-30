package com.rideshare.app.repository;

import com.rideshare.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findTop8ByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String fullName, String email);

    long countByLastLoginAtAfter(java.time.LocalDateTime date);

    List<User> findByEmailIn(java.util.List<String> emails);
}
