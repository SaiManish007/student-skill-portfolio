package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.auth.AuthResponse;
import com.skillfolio.portfolio.dto.auth.LoginRequest;
import com.skillfolio.portfolio.dto.auth.RegisterRequest;
import com.skillfolio.portfolio.dto.auth.UserSummaryDto;
import com.skillfolio.portfolio.entity.Role;
import com.skillfolio.portfolio.entity.StudentProfile;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.exception.BadRequestException;
import com.skillfolio.portfolio.exception.ResourceNotFoundException;
import com.skillfolio.portfolio.repository.StudentProfileRepository;
import com.skillfolio.portfolio.repository.UserRepository;
import com.skillfolio.portfolio.security.JwtTokenProvider;
import com.skillfolio.portfolio.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       StudentProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new BadRequestException("An account with this email already exists");
        }

        // Roles are strictly assigned as STUDENT during registration to prevent privilege escalation
        User user = new User(cleanEmail, passwordEncoder.encode(request.getPassword()), Role.STUDENT);
        User savedUser = userRepository.save(user);

        // Create default profile with unique slug
        StudentProfile profile = new StudentProfile(savedUser, request.getFullName().trim());
        String initialSlug = generateUniqueSlug(request.getFullName().trim());
        profile.setPortfolioSlug(initialSlug);
        profileRepository.save(profile);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String token = tokenProvider.generateToken(principal);

        UserSummaryDto userSummary = new UserSummaryDto(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole(),
                profile.getFullName(),
                profile.getPortfolioSlug(),
                profile.isPublished()
        );

        return new AuthResponse(token, userSummary);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(principal);

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        String fullName = profile != null ? profile.getFullName() : user.getEmail();
        String slug = profile != null ? profile.getPortfolioSlug() : null;
        boolean published = profile != null && profile.isPublished();

        UserSummaryDto userSummary = new UserSummaryDto(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                fullName,
                slug,
                published
        );

        return new AuthResponse(token, userSummary);
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        String fullName = profile != null ? profile.getFullName() : user.getEmail();
        String slug = profile != null ? profile.getPortfolioSlug() : null;
        boolean published = profile != null && profile.isPublished();

        return new UserSummaryDto(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                fullName,
                slug,
                published
        );
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        if (base.isEmpty()) {
            base = "student";
        }

        String candidate = base;
        Random random = new Random();
        while (profileRepository.existsByPortfolioSlugIgnoreCase(candidate)) {
            candidate = base + "-" + (1000 + random.nextInt(9000));
        }
        return candidate;
    }
}
