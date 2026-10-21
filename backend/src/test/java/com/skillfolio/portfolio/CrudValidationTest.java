package com.skillfolio.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillfolio.portfolio.dto.certification.CertificationRequest;
import com.skillfolio.portfolio.dto.project.ProjectRequest;
import com.skillfolio.portfolio.dto.skill.SkillRequest;
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
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CrudValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TestCleanupService cleanupService;

    private String token;

    @BeforeEach
    void setUp() {
        cleanupService.cleanAll();
        User user = userRepository.save(new User("valid@test.edu", passwordEncoder.encode("Pass123!"), Role.STUDENT));
        token = tokenProvider.generateToken(UserPrincipal.create(user));
    }

    @Test
    void testInvalidSkillCategoryRejected() throws Exception {
        SkillRequest invalidSkill = new SkillRequest("Java", "INVALID_CAT", "BEGINNER", new BigDecimal("1.0"));

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidSkill)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.category", notNullValue()));
    }

    @Test
    void testNegativeExperienceRejected() throws Exception {
        SkillRequest invalidSkill = new SkillRequest("Java", "TECHNICAL", "BEGINNER", new BigDecimal("-2.0"));

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidSkill)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.yearsOfExperience", notNullValue()));
    }

    @Test
    void testBlankProjectTitleRejected() throws Exception {
        ProjectRequest invalidProject = new ProjectRequest();
        invalidProject.setTitle("");
        invalidProject.setDescription("Some description");
        invalidProject.setTechnologies("React");
        invalidProject.setStatus("COMPLETED");

        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidProject)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title", notNullValue()));
    }

    @Test
    void testInvalidUrlPatternRejected() throws Exception {
        CertificationRequest invalidCert = new CertificationRequest();
        invalidCert.setName("AWS Solutions Architect");
        invalidCert.setIssuer("Amazon Web Services");
        invalidCert.setIssueDate(java.time.LocalDate.now());
        invalidCert.setCredentialUrl("ftp://not-a-valid-http-url");

        mockMvc.perform(post("/api/certifications")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidCert)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.credentialUrl", notNullValue()));
    }
}
