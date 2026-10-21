package com.skillfolio.portfolio;

import com.skillfolio.portfolio.entity.Role;
import com.skillfolio.portfolio.entity.StudentProfile;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.repository.StudentProfileRepository;
import com.skillfolio.portfolio.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PublicPortfolioPrivacyTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TestCleanupService cleanupService;

    @BeforeEach
    void setUp() {
        cleanupService.cleanAll();
    }

    @Test
    void testUnpublishedPortfolioReturnsNotFound() throws Exception {
        User user = userRepository.save(new User("private@test.edu", passwordEncoder.encode("SecretPass1!"), Role.STUDENT));
        StudentProfile profile = new StudentProfile(user, "Private Student");
        profile.setPortfolioSlug("private-student");
        profile.setPublished(false);
        profileRepository.save(profile);

        mockMvc.perform(get("/api/public/portfolio/private-student"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testPublishedPortfolioReturnsOnlyPublicSafeFields() throws Exception {
        User user = userRepository.save(new User("published@test.edu", passwordEncoder.encode("SecretPass1!"), Role.STUDENT));
        StudentProfile profile = new StudentProfile(user, "Public Student");
        profile.setPhone("+1234567890"); // Private phone
        profile.setCollege("Stanford University");
        profile.setDepartment("Computer Science");
        profile.setDegree("B.Tech");
        profile.setBio("Passionate full stack developer and researcher.");
        profile.setPortfolioSlug("public-student");
        profile.setPublished(true);
        profileRepository.save(profile);

        mockMvc.perform(get("/api/public/portfolio/public-student"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Public Student"))
                .andExpect(jsonPath("$.data.college").value("Stanford University"))
                .andExpect(jsonPath("$.data.bio").value("Passionate full stack developer and researcher."))
                // Strict privacy verification: Private personal & security fields MUST NOT BE PRESENT
                .andExpect(jsonPath("$.data.email").doesNotExist())
                .andExpect(jsonPath("$.data.phone").doesNotExist())
                .andExpect(jsonPath("$.data.userId").doesNotExist())
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.data.jwt").doesNotExist());
    }
}
