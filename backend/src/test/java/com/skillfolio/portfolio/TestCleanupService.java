package com.skillfolio.portfolio;

import com.skillfolio.portfolio.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class TestCleanupService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private StudentProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void cleanAll() {
        achievementRepository.deleteAll();
        certificationRepository.deleteAll();
        projectRepository.deleteAll();
        skillRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();
    }
}
