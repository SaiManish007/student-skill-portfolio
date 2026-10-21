package com.skillfolio.portfolio.dto.dashboard;

import com.skillfolio.portfolio.dto.project.ProjectResponse;

import java.util.List;
import java.util.Map;

public class StudentDashboardDto {

    private long totalSkills;
    private long totalProjects;
    private long totalCertifications;
    private long totalAchievements;
    private int profileCompletionPercentage;
    private boolean isPublished;
    private String portfolioSlug;
    private String fullName;

    // Coding profile links availability
    private boolean githubConfigured;
    private boolean leetcodeConfigured;
    private boolean codechefConfigured;
    private boolean linkedinConfigured;

    // Real skill counts by category for charts
    private Map<String, Long> skillsByCategory;

    // Top recent projects
    private List<ProjectResponse> recentProjects;

    public StudentDashboardDto() {
    }

    public long getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(long totalSkills) {
        this.totalSkills = totalSkills;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalCertifications() {
        return totalCertifications;
    }

    public void setTotalCertifications(long totalCertifications) {
        this.totalCertifications = totalCertifications;
    }

    public long getTotalAchievements() {
        return totalAchievements;
    }

    public void setTotalAchievements(long totalAchievements) {
        this.totalAchievements = totalAchievements;
    }

    public int getProfileCompletionPercentage() {
        return profileCompletionPercentage;
    }

    public void setProfileCompletionPercentage(int profileCompletionPercentage) {
        this.profileCompletionPercentage = profileCompletionPercentage;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean published) {
        isPublished = published;
    }

    public String getPortfolioSlug() {
        return portfolioSlug;
    }

    public void setPortfolioSlug(String portfolioSlug) {
        this.portfolioSlug = portfolioSlug;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public boolean isGithubConfigured() {
        return githubConfigured;
    }

    public void setGithubConfigured(boolean githubConfigured) {
        this.githubConfigured = githubConfigured;
    }

    public boolean isLeetcodeConfigured() {
        return leetcodeConfigured;
    }

    public void setLeetcodeConfigured(boolean leetcodeConfigured) {
        this.leetcodeConfigured = leetcodeConfigured;
    }

    public boolean isCodechefConfigured() {
        return codechefConfigured;
    }

    public void setCodechefConfigured(boolean codechefConfigured) {
        this.codechefConfigured = codechefConfigured;
    }

    public boolean isLinkedinConfigured() {
        return linkedinConfigured;
    }

    public void setLinkedinConfigured(boolean linkedinConfigured) {
        this.linkedinConfigured = linkedinConfigured;
    }

    public Map<String, Long> getSkillsByCategory() {
        return skillsByCategory;
    }

    public void setSkillsByCategory(Map<String, Long> skillsByCategory) {
        this.skillsByCategory = skillsByCategory;
    }

    public List<ProjectResponse> getRecentProjects() {
        return recentProjects;
    }

    public void setRecentProjects(List<ProjectResponse> recentProjects) {
        this.recentProjects = recentProjects;
    }
}
