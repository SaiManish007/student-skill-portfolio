package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.portfolio.PublicPortfolioDto;
import com.skillfolio.portfolio.entity.StudentProfile;
import com.skillfolio.portfolio.exception.ResourceNotFoundException;
import com.skillfolio.portfolio.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class PublicPortfolioService {

    private final StudentProfileRepository profileRepository;
    private final SkillService skillService;
    private final ProjectService projectService;
    private final CertificationService certificationService;
    private final AchievementService achievementService;

    public PublicPortfolioService(StudentProfileRepository profileRepository,
                                  SkillService skillService,
                                  ProjectService projectService,
                                  CertificationService certificationService,
                                  AchievementService achievementService) {
        this.profileRepository = profileRepository;
        this.skillService = skillService;
        this.projectService = projectService;
        this.certificationService = certificationService;
        this.achievementService = achievementService;
    }

    @Transactional(readOnly = true)
    public PublicPortfolioDto getPublicPortfolioBySlug(String slug) {
        String cleanSlug = slug.trim().toLowerCase(Locale.ROOT);

        StudentProfile profile = profileRepository.findByPortfolioSlugIgnoreCase(cleanSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Public portfolio not found for slug: " + cleanSlug));

        if (!profile.isPublished()) {
            throw new ResourceNotFoundException("This portfolio is currently private and has not been published");
        }

        if (!profile.getUser().isActive()) {
            throw new ResourceNotFoundException("This user account is currently deactivated");
        }

        Long userId = profile.getUser().getId();

        PublicPortfolioDto dto = new PublicPortfolioDto();
        dto.setFullName(profile.getFullName());
        dto.setCollege(profile.getCollege());
        dto.setDepartment(profile.getDepartment());
        dto.setDegree(profile.getDegree());
        dto.setAcademicYear(profile.getAcademicYear());
        dto.setGraduationYear(profile.getGraduationYear());
        dto.setBio(profile.getBio());
        dto.setLocation(profile.getLocation());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setLeetcodeUrl(profile.getLeetcodeUrl());
        dto.setCodechefUrl(profile.getCodechefUrl());
        dto.setPortfolioSlug(profile.getPortfolioSlug());

        // Note: NEVER set email, phone, userId, or internal IDs in PublicPortfolioDto!
        dto.setSkills(skillService.getSkills(userId, null));
        dto.setProjects(projectService.getProjects(userId));
        dto.setCertifications(certificationService.getCertifications(userId));
        dto.setAchievements(achievementService.getAchievements(userId));

        return dto;
    }
}
