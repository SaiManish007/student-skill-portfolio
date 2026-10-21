package com.skillfolio.portfolio.dto.admin;

import com.skillfolio.portfolio.dto.achievement.AchievementResponse;
import com.skillfolio.portfolio.dto.certification.CertificationResponse;
import com.skillfolio.portfolio.dto.profile.StudentProfileResponse;
import com.skillfolio.portfolio.dto.project.ProjectResponse;
import com.skillfolio.portfolio.dto.skill.SkillResponse;

import java.time.LocalDateTime;
import java.util.List;

public class AdminStudentDetailDto {

    private Long userId;
    private String email;
    private boolean active;
    private LocalDateTime registeredAt;

    private StudentProfileResponse profile;
    private List<SkillResponse> skills;
    private List<ProjectResponse> projects;
    private List<CertificationResponse> certifications;
    private List<AchievementResponse> achievements;

    public AdminStudentDetailDto() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public StudentProfileResponse getProfile() {
        return profile;
    }

    public void setProfile(StudentProfileResponse profile) {
        this.profile = profile;
    }

    public List<SkillResponse> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillResponse> skills) {
        this.skills = skills;
    }

    public List<ProjectResponse> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectResponse> projects) {
        this.projects = projects;
    }

    public List<CertificationResponse> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<CertificationResponse> certifications) {
        this.certifications = certifications;
    }

    public List<AchievementResponse> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<AchievementResponse> achievements) {
        this.achievements = achievements;
    }
}
