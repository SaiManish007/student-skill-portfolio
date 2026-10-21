package com.skillfolio.portfolio;

import com.skillfolio.portfolio.entity.Role;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.repository.UserRepository;
import com.skillfolio.portfolio.security.JwtTokenProvider;
import com.skillfolio.portfolio.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RoleAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TestCleanupService cleanupService;

    @BeforeEach
    void setUp() {
        cleanupService.cleanAll();
    }

    @Test
    void testAdminEndpointRejectsUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/admin/students"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testAdminEndpointRejectsStudentRole() throws Exception {
        User student = new User("student@test.edu", passwordEncoder.encode("Password123!"), Role.STUDENT);
        userRepository.save(student);

        String token = tokenProvider.generateToken(UserPrincipal.create(student));

        mockMvc.perform(get("/api/admin/students")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminEndpointAllowsAdminRole() throws Exception {
        User admin = new User("admin@test.edu", passwordEncoder.encode("Password123!"), Role.ADMIN);
        userRepository.save(admin);

        String token = tokenProvider.generateToken(UserPrincipal.create(admin));

        mockMvc.perform(get("/api/admin/students")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
