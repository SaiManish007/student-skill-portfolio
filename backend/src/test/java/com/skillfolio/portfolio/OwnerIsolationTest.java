package com.skillfolio.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillfolio.portfolio.dto.project.ProjectRequest;
import com.skillfolio.portfolio.dto.skill.SkillRequest;
import com.skillfolio.portfolio.entity.Project;
import com.skillfolio.portfolio.entity.Role;
import com.skillfolio.portfolio.entity.Skill;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.repository.ProjectRepository;
import com.skillfolio.portfolio.repository.SkillRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class OwnerIsolationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TestCleanupService cleanupService;

    private User userA;
    private User userB;
    private String tokenB;

    @BeforeEach
    void setUp() {
        cleanupService.cleanAll();

        userA = userRepository.save(new User("usera@test.edu", passwordEncoder.encode("Pass123!"), Role.STUDENT));
        userB = userRepository.save(new User("userb@test.edu", passwordEncoder.encode("Pass123!"), Role.STUDENT));

        tokenB = tokenProvider.generateToken(UserPrincipal.create(userB));
    }

    @Test
    void testUserBCannotUpdateUserASkill() throws Exception {
        Skill skill = skillRepository.save(new Skill(userA, "Java", "TECHNICAL", "ADVANCED", new BigDecimal("2.5")));

        SkillRequest updateReq = new SkillRequest("Java Expert", "TECHNICAL", "EXPERT", new BigDecimal("3.0"));

        mockMvc.perform(put("/api/skills/" + skill.getId())
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUserBCannotDeleteUserASkill() throws Exception {
        Skill skill = skillRepository.save(new Skill(userA, "Python", "TECHNICAL", "INTERMEDIATE", new BigDecimal("1.0")));

        mockMvc.perform(delete("/api/skills/" + skill.getId())
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUserBCannotUpdateUserAProject() throws Exception {
        Project project = projectRepository.save(new Project(userA, "Portfolio System", "Full stack Spring Boot React", "Java, React", "COMPLETED"));

        ProjectRequest updateReq = new ProjectRequest();
        updateReq.setTitle("Malicious Overwrite");
        updateReq.setDescription("Attempt to overwrite");
        updateReq.setTechnologies("Hacking");
        updateReq.setStatus("COMPLETED");

        mockMvc.perform(put("/api/projects/" + project.getId())
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUserBCannotDeleteUserAProject() throws Exception {
        Project project = projectRepository.save(new Project(userA, "E-Commerce System", "Online shopping portal", "Java, Postgres", "COMPLETED"));

        mockMvc.perform(delete("/api/projects/" + project.getId())
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());
    }
}
