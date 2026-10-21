package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.dashboard.AdminDashboardDto;
import com.skillfolio.portfolio.dto.dashboard.StudentDashboardDto;
import com.skillfolio.portfolio.dto.project.ProjectResponse;
import com.skillfolio.portfolio.entity.Role;
import com.skillfolio.portfolio.entity.StudentProfile;
import com.skillfolio.portfolio.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    private final AchievementRepository achievementRepository;
    private final ProjectService projectService;

    public DashboardService(UserRepository userRepository,
                            StudentProfileRepository profileRepository,
                            SkillRepository skillRepository,
                            ProjectRepository projectRepository,
                            CertificationRepository certificationRepository,
                            AchievementRepository achievementRepository,
                            ProjectService projectService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.certificationRepository = certificationRepository;
        this.achievementRepository = achievementRepository;
        this.projectService = projectService;
    }

    @Transactional(readOnly = true)
    public StudentDashboardDto getStudentDashboard(Long userId) {
        StudentProfile profile = profileRepository.findByUserId(userId).orElse(null);

        long totalSkills = skillRepository.countByUserId(userId);
        long totalProjects = projectRepository.countByUserId(userId);
        long totalCerts = certificationRepository.countByUserId(userId);
        long totalAchievements = achievementRepository.countByUserId(userId);

        StudentDashboardDto dto = new StudentDashboardDto();
        dto.setTotalSkills(totalSkills);
        dto.setTotalProjects(totalProjects);
        dto.setTotalCertifications(totalCerts);
        dto.setTotalAchievements(totalAchievements);

        if (profile != null) {
            dto.setFullName(profile.getFullName());
            dto.setPortfolioSlug(profile.getPortfolioSlug());
            dto.setPublished(profile.isPublished());

            dto.setGithubConfigured(StringUtils.hasText(profile.getGithubUrl()));
            dto.setLeetcodeConfigured(StringUtils.hasText(profile.getLeetcodeUrl()));
            dto.setCodechefConfigured(StringUtils.hasText(profile.getCodechefUrl()));
            dto.setLinkedinConfigured(StringUtils.hasText(profile.getLinkedinUrl()));

            // Calculate profile completion percentage based on real DB fields
            int completion = 0;
            if (StringUtils.hasText(profile.getFullName())) completion += 10;
            if (StringUtils.hasText(profile.getCollege()) && StringUtils.hasText(profile.getDepartment())) completion += 10;
            if (StringUtils.hasText(profile.getDegree())) completion += 10;
            if (StringUtils.hasText(profile.getBio())) completion += 15;
            if (StringUtils.hasText(profile.getLocation())) completion += 5;
            if (StringUtils.hasText(profile.getProfileImageUrl())) completion += 10;
            if (dto.isGithubConfigured() || dto.isLinkedinConfigured() || dto.isLeetcodeConfigured()) completion += 10;
            if (totalSkills > 0) completion += 15;
            if (totalProjects > 0) completion += 15;
            if (totalCerts > 0 || totalAchievements > 0) completion += 10;

            dto.setProfileCompletionPercentage(Math.min(100, completion));
        } else {
            dto.setProfileCompletionPercentage(0);
        }

        // Skills breakdown by category
        Map<String, Long> skillsByCategory = new HashMap<>();
        skillsByCategory.put("Technical", skillRepository.countByUserIdAndCategoryIgnoreCase(userId, "TECHNICAL"));
        skillsByCategory.put("Soft", skillRepository.countByUserIdAndCategoryIgnoreCase(userId, "SOFT"));
        skillsByCategory.put("Tools", skillRepository.countByUserIdAndCategoryIgnoreCase(userId, "TOOLS"));
        dto.setSkillsByCategory(skillsByCategory);

        // Recent 5 projects
        List<ProjectResponse> recentProjects = projectRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(projectService::mapToResponse)
                .toList();
        dto.setRecentProjects(recentProjects);

        return dto;
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto getAdminDashboard() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalProjects = projectRepository.count();
        long totalSkills = skillRepository.count();
        long totalCertifications = certificationRepository.count();
        long totalAchievements = achievementRepository.count();
        long publishedPortfolios = profileRepository.countByIsPublishedTrue();

        return new AdminDashboardDto(
                totalStudents,
                totalProjects,
                totalSkills,
                totalCertifications,
                totalAchievements,
                publishedPortfolios
        );
    }
}
