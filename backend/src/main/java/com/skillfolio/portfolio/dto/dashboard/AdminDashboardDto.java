package com.skillfolio.portfolio.dto.dashboard;

public class AdminDashboardDto {

    private long totalStudents;
    private long totalProjects;
    private long totalSkills;
    private long totalCertifications;
    private long totalAchievements;
    private long publishedPortfolios;

    public AdminDashboardDto() {
    }

    public AdminDashboardDto(long totalStudents, long totalProjects, long totalSkills, long totalCertifications, long totalAchievements, long publishedPortfolios) {
        this.totalStudents = totalStudents;
        this.totalProjects = totalProjects;
        this.totalSkills = totalSkills;
        this.totalCertifications = totalCertifications;
        this.totalAchievements = totalAchievements;
        this.publishedPortfolios = publishedPortfolios;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(long totalSkills) {
        this.totalSkills = totalSkills;
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

    public long getPublishedPortfolios() {
        return publishedPortfolios;
    }

    public void setPublishedPortfolios(long publishedPortfolios) {
        this.publishedPortfolios = publishedPortfolios;
    }
}
