package com.skillfolio.portfolio.service;

import com.skillfolio.portfolio.dto.admin.AdminStudentDetailDto;
import com.skillfolio.portfolio.dto.admin.AdminStudentSummaryDto;
import com.skillfolio.portfolio.entity.StudentProfile;
import com.skillfolio.portfolio.entity.User;
import com.skillfolio.portfolio.exception.ResourceNotFoundException;
import com.skillfolio.portfolio.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    private final ProfileService profileService;
    private final SkillService skillService;
    private final ProjectService projectService;
    private final CertificationService certificationService;
    private final AchievementService achievementService;

    public AdminService(UserRepository userRepository,
                        StudentProfileRepository profileRepository,
                        SkillRepository skillRepository,
                        ProjectRepository projectRepository,
                        CertificationRepository certificationRepository,
                        ProfileService profileService,
                        SkillService skillService,
                        ProjectService projectService,
                        CertificationService certificationService,
                        AchievementService achievementService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.certificationRepository = certificationRepository;
        this.profileService = profileService;
        this.skillService = skillService;
        this.projectService = projectService;
        this.certificationService = certificationService;
        this.achievementService = achievementService;
    }

    @Transactional(readOnly = true)
    public Page<AdminStudentSummaryDto> searchStudents(String query, Pageable pageable) {
        Page<StudentProfile> profiles = profileRepository.searchProfiles(query, pageable);
        return profiles.map(this::mapToSummary);
    }

    @Transactional(readOnly = true)
    public AdminStudentDetailDto getStudentDetail(Long studentUserId) {
        User user = userRepository.findById(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with user ID: " + studentUserId));

        StudentProfile profile = profileRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for student ID: " + studentUserId));

        AdminStudentDetailDto dto = new AdminStudentDetailDto();
        dto.setUserId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setActive(user.isActive());
        dto.setRegisteredAt(user.getCreatedAt());

        dto.setProfile(profileService.mapToResponse(profile));
        dto.setSkills(skillService.getSkills(studentUserId, null));
        dto.setProjects(projectService.getProjects(studentUserId));
        dto.setCertifications(certificationService.getCertifications(studentUserId));
        dto.setAchievements(achievementService.getAchievements(studentUserId));

        return dto;
    }

    @Transactional
    public void updateUserActiveStatus(Long studentUserId, boolean active) {
        User user = userRepository.findById(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with user ID: " + studentUserId));

        user.setActive(active);
        userRepository.save(user);
    }

    private AdminStudentSummaryDto mapToSummary(StudentProfile profile) {
        AdminStudentSummaryDto dto = new AdminStudentSummaryDto();
        dto.setProfileId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setFullName(profile.getFullName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setCollege(profile.getCollege());
        dto.setDepartment(profile.getDepartment());
        dto.setDegree(profile.getDegree());
        dto.setPortfolioSlug(profile.getPortfolioSlug());
        dto.setPublished(profile.isPublished());
        dto.setActive(profile.getUser().isActive());
        dto.setRegisteredAt(profile.getUser().getCreatedAt());

        Long uid = profile.getUser().getId();
        dto.setTotalSkills(skillRepository.countByUserId(uid));
        dto.setTotalProjects(projectRepository.countByUserId(uid));
        dto.setTotalCertifications(certificationRepository.countByUserId(uid));

        return dto;
    }
}
