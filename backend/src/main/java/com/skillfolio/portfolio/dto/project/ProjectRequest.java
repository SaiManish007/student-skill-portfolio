package com.skillfolio.portfolio.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    @Size(min = 2, max = 200, message = "Project title must be between 2 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    @NotBlank(message = "Technologies are required")
    @Size(max = 500, message = "Technologies cannot exceed 500 characters")
    private String technologies;

    @Size(max = 100, message = "Role cannot exceed 100 characters")
    private String role;

    private LocalDate startDate;
    private LocalDate endDate;

    @Pattern(regexp = "^(https?://.+)?$", message = "GitHub URL must be a valid URL starting with http:// or https://")
    @Size(max = 500, message = "GitHub URL cannot exceed 500 characters")
    private String githubUrl;

    @Pattern(regexp = "^(https?://.+)?$", message = "Live demo URL must be a valid URL starting with http:// or https://")
    @Size(max = 500, message = "Live demo URL cannot exceed 500 characters")
    private String liveDemoUrl;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(?i)(COMPLETED|IN_PROGRESS|PLANNED)$", message = "Status must be COMPLETED, IN_PROGRESS, or PLANNED")
    private String status;

    public ProjectRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLiveDemoUrl() {
        return liveDemoUrl;
    }

    public void setLiveDemoUrl(String liveDemoUrl) {
        this.liveDemoUrl = liveDemoUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
