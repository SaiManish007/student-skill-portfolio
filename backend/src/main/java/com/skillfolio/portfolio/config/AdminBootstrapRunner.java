package com.skillfolio.portfolio.config;

import com.skillfolio.portfolio.entity.Role;
import com.skillfolio.portfolio.entity.StudentProfile;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.repository.StudentProfileRepository;
import com.skillfolio.portfolio.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    private final boolean enabled;
    private final String email;
    private final String password;
    private final String name;

    public AdminBootstrapRunner(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.bootstrap.enabled:false}") boolean enabled,
            @Value("${app.admin.bootstrap.email:}") String email,
            @Value("${app.admin.bootstrap.password:}") String password,
            @Value("${app.admin.bootstrap.name:System Administrator}") String name) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.enabled = enabled;
        this.email = email;
        this.password = password;
        this.name = name;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!enabled) {
            return;
        }

        if (!StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            logger.warn("Admin bootstrap enabled but ADMIN_BOOTSTRAP_EMAIL or ADMIN_BOOTSTRAP_PASSWORD is not provided");
            return;
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            logger.info("Admin account already exists for email: {}", email);
            return;
        }

        User admin = new User(email, passwordEncoder.encode(password), Role.ADMIN);
        User savedAdmin = userRepository.save(admin);

        StudentProfile profile = new StudentProfile(savedAdmin, name);
        profileRepository.save(profile);

        logger.info("Successfully bootstrapped initial admin account for email: {}", email);
    }
}
